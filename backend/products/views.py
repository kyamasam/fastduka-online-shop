from copy import deepcopy
from django.db.models import Case, When, Subquery, OuterRef, BooleanField, Sum, Q
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters as rest_framework_filters
from django_filters import rest_framework as filters
from rest_framework import filters as rest_framework_filters, permissions
from inventory.models import Inventory
from products.models import Category, Product, ProductPhoto, ProductReview, CategoryType, TaxRate, Brand, Collection
from products.serializers import CategorySerializer, ProductSerializer, ProductPhotoSerializer, \
    ProductVariantSerializer, ProductVariantPhotoSerializer, ReviewSerializer, CategoryTypeSerializer, TaxRateSerializer, BrandSerializer, CollectionSerializer
from users.permissions import AnonReadAdminCreate
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiResponse

class TaxViewSet(viewsets.ModelViewSet):
    model = TaxRate
    queryset= TaxRate.objects.all()
    serializer_class=TaxRateSerializer
    permission_classes=[AnonReadAdminCreate]
    
    @action(url_path="unpaged", detail=False, methods=["get"], permission_classes=[AnonReadAdminCreate])
    def tax_rates_unpaged(self, request):
        # Fetch the data
        queryset = TaxRate.objects.all()
        if queryset.count() <1:
            TaxRate.objects.create(
                name="VAT",
                rate="0.16",
                description="VAT",
                is_default=True,
                is_active=True
            )
            queryset = TaxRate.objects.all()
        serializer = TaxRateSerializer(queryset, many=True) 
        return Response(serializer.data)
    
    
class CategoryTypeViewSet(viewsets.ModelViewSet):
    serializer_class = CategoryTypeSerializer
    queryset = CategoryType.objects.all()
    model = CategoryType
    permission_classes = [AnonReadAdminCreate]

    @extend_schema(
        summary="Get all category types without pagination",
        description="Retrieve a complete list of all category types in the system without applying pagination limits. this returns an array of the below object",
        responses=CategoryTypeSerializer()
    )
    @action(detail=False, methods=['get'], url_path="categories-types-unpaged")
    def category_types_unpaged(self, request):
        category_types = self.get_queryset()

        return Response(CategoryTypeSerializer(category_types, many=True).data) 

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    model = Category
    permission_classes = [AnonReadAdminCreate]

    filterset_fields= { 'category_type':['exact']}
    
    @extend_schema(
        summary="Get all categories without pagination",
        description="Retrieve a complete list of all categories in the system without applying pagination limits. this returns an array of the below object",
        responses=CategorySerializer()
    )
    @action(detail=False, methods=['get'], url_path="categories-unpaged")
    def get_categories_unpaged(self, request):
        categories = self.get_queryset()

        return Response(CategorySerializer(categories, many=True).data)


class BrandViewSet(viewsets.ModelViewSet):
    serializer_class = BrandSerializer
    queryset = Brand.objects.all()
    model = Brand
    permission_classes = [AnonReadAdminCreate]
    search_fields = ['name', 'description']

    @extend_schema(
        summary="Get all brands without pagination",
        description="Retrieve a complete list of all brands in the system without applying pagination limits.",
        responses=BrandSerializer()
    )
    @action(detail=False, methods=['get'], url_path="brands-unpaged")
    def get_brands_unpaged(self, request):
        brands = self.get_queryset()
        return Response(BrandSerializer(brands, many=True).data)


class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    queryset = Collection.objects.all()
    model = Collection
    permission_classes = [AnonReadAdminCreate]
    search_fields = ['name', 'description']

    @extend_schema(
        summary="Get all collections without pagination",
        description="Retrieve a complete list of all collections in the system without applying pagination limits.",
        responses=CollectionSerializer()
    )
    @action(detail=False, methods=['get'], url_path="collections-unpaged")
    def get_collections_unpaged(self, request):
        collections = self.get_queryset()
        return Response(CollectionSerializer(collections, many=True).data)


class ProductFilter(filters.FilterSet):
    in_stock = filters.BooleanFilter()
    on_sale = filters.BooleanFilter()
    category_id = filters.BaseInFilter(field_name='category_id', lookup_expr='in')
    category_slug = filters.BaseInFilter(field_name='category__slug', lookup_expr='in')
    brand_id = filters.BaseInFilter(field_name='brands__id', lookup_expr='in')
    brand_slug = filters.BaseInFilter(field_name='brands__slug', lookup_expr='in')
    collection_id = filters.BaseInFilter(field_name='collections__id', lookup_expr='in')
    collection_slug = filters.BaseInFilter(field_name='collections__slug', lookup_expr='in')
    selling_price = filters.RangeFilter()

    class Meta:
        model = Product
        fields = {
            'product_type': ['exact'],
            'featured': ['exact'],
            'selling_price': ['lte', 'gte'],
        }




class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    model = Product
    queryset = Product.objects.all().order_by('-created_at')
    permission_classes = [AnonReadAdminCreate]

    filter_backends = [
        DjangoFilterBackend, 
        rest_framework_filters.SearchFilter,
        rest_framework_filters.OrderingFilter  
    ]
    filterset_class = ProductFilter
    search_fields = [
        'name',
        'description',
        'sku',
    ]
    ordering_fields = ['created_at', 'name', 'price']  # Fields that can be sorted
    ordering = ['-created_at']  # Default ordering (newest first)

    def filter_queryset(self, queryset):
        q_params = self.request.query_params.dict()
        in_stock = q_params.pop('in_stock', None)
        category_id__in = q_params.pop('category_id__in', None)
        category_slug = q_params.pop('category_slug', None)
        brand_id__in = q_params.pop('brand_id__in', None)
        brand_slug = q_params.pop('brand_slug', None)
        collection_id__in = q_params.pop('collection_id__in', None)
        collection_slug = q_params.pop('collection_slug', None)
        on_sale = q_params.pop('on_sale', None)
        # Remove pagination-related query parameters
        q_params.pop('limit', None)
        q_params.pop('offset', None)
        q_params.pop('page', None)
        search = q_params.pop('search', None)
        q_params.pop('ordering', None)  # Remove ordering param so it doesn't interfere

        qs = super().get_queryset().filter(**q_params)

        if in_stock is not None:
            qs = qs.annotate(inventory_total=Sum('inventory__quantity'))
            if in_stock.lower() == 'true' or in_stock == 1:
                qs = qs.filter(inventory_total__gt=0)
            else:
                qs = qs.filter(Q(inventory_total__isnull=True) | Q(inventory_total__lt=1))

        if on_sale is not None:
            if on_sale.lower() == 'true' or on_sale == 1:
                qs = qs.filter(sale_price__gt=0)
            else:
                qs = qs.filter(sale_price__lt=1)

        if category_id__in is not None:
            category_id__in = category_id__in.split(',')
            qs = qs.filter(category_id__in=[int(i) for i in category_id__in])

        if category_slug is not None:
            category_slugs = category_slug.split(',')
            qs = qs.filter(category__slug__in=category_slugs)

        if brand_id__in is not None:
            brand_ids = brand_id__in.split(',')
            qs = qs.filter(brands__id__in=[int(i) for i in brand_ids]).distinct()

        if brand_slug is not None:
            brand_slugs = brand_slug.split(',')
            qs = qs.filter(brands__slug__in=brand_slugs).distinct()

        if collection_id__in is not None:
            collection_ids = collection_id__in.split(',')
            qs = qs.filter(collections__id__in=[int(i) for i in collection_ids]).distinct()

        if collection_slug is not None:
            collection_slugs = collection_slug.split(',')
            qs = qs.filter(collections__slug__in=collection_slugs).distinct()

        if search is not None:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(sku__icontains=search)
            )
            
        

        return qs


class ProductPhotoViewSet(viewsets.ModelViewSet):
    serializer_class = ProductPhotoSerializer
    model = Category
    queryset = ProductPhoto.objects.all()
    permission_classes = [AnonReadAdminCreate]

class ProductVariantViewSet(viewsets.ModelViewSet):
    serializer_class = ProductVariantSerializer
    model = Category
    permission_classes = [AnonReadAdminCreate]

class ProductVariantPhotoViewSet(viewsets.ModelViewSet):
    serializer_class = ProductVariantPhotoSerializer
    model = Category
    permission_classes = [AnonReadAdminCreate]



class ReviewViewSet(viewsets.ModelViewSet):
    queryset = ProductReview.objects.select_related('user', 'product').all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [rest_framework_filters.SearchFilter, rest_framework_filters.OrderingFilter]
    search_fields = ['description', 'title', 'reviewer_name']
    ordering_fields = ['created_at', 'review_value']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Optionally restricts the returned reviews to a given product,
        by filtering against a `product` query parameter in the URL.
        Also allows filtering by user's reviews.
        """
        queryset = super().get_queryset()
        
        # Filter by product
        product_id = self.request.query_params.get('product', None)
        if product_id is not None:
            queryset = queryset.filter(product_id=product_id)
        
        # Filter by user's reviews
        user_reviews = self.request.query_params.get('my_reviews', None)
        if user_reviews and self.request.user.is_authenticated:
            queryset = queryset.filter(user=self.request.user)
        
        return queryset

    def get_permissions(self):
        """
        Override to allow anonymous users to create reviews
        """
        if self.action == 'create':
            return []
        return super().get_permissions()

    def perform_create(self, serializer):
        """
        Handle review creation for both authenticated and anonymous users.
        For authenticated users, use their account details.
        """
        if self.request.user.is_authenticated:
            # For authenticated users, use their account
            serializer.save(
                email=self.request.user.email,
                name=self.request.user.get_full_name() or self.request.user.email
            )
        else:
            # For anonymous users, let the serializer handle the logic
            serializer.save()

    @action(detail=False, methods=['GET'])
    def product_stats(self, request):
        """Get review statistics for a specific product"""
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response({"error": "product_id is required"}, status=400)

        stats = self.get_queryset().filter(product_id=product_id).aggregate(
            average_rating=Avg('review_value'),
            total_reviews=models.Count('id')
        )
        
        return Response(stats)

    @action(detail=False, methods=['GET'])
    def my_reviews(self, request):
        """Get reviews created by the current user"""
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=401)
            
        reviews = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)