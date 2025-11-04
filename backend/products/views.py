from copy import deepcopy

from django.db.models import Case, When, Subquery, OuterRef, BooleanField, Sum, Q
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters as rest_framework_filters
from django_filters import rest_framework as filters
from rest_framework import filters as rest_framework_filters, permissions
from inventory.models import Inventory
from products.models import Category, Product, ProductPhoto, ProductReview, CategoryType
from products.serializers import CategorySerializer, ProductSerializer, ProductPhotoSerializer, \
    ProductVariantSerializer, ProductVariantPhotoSerializer, ReviewSerializer, CategoryTypeSerializer
from users.permissions import AnonReadAdminCreate
from rest_framework.response import Response
from rest_framework.decorators import action


class CategoryTypeViewSet(viewsets.ModelViewSet):
    serializer_class = CategoryTypeSerializer
    queryset = CategoryType.objects.all()
    model = CategoryType
    permission_classes = [AnonReadAdminCreate]


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    model = Category
    permission_classes = [AnonReadAdminCreate]

    filterset_fields= { 'category_type':['exact']}

class ProductFilter(filters.FilterSet):
    in_stock = filters.BooleanFilter()
    on_sale = filters.BooleanFilter()
    category_id = filters.BaseInFilter(field_name='category_id', lookup_expr='in')
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
    queryset = Product.objects.all()
    permission_classes = [AnonReadAdminCreate]

    filter_backends =[DjangoFilterBackend, rest_framework_filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = [
        'name',
        'description',
    ]

    def filter_queryset(self, queryset):
        q_params = ( self.request.query_params.dict())
        in_stock = q_params.pop('in_stock', None)
        category_id__in = q_params.pop('category_id__in', None)
        on_sale = q_params.pop('on_sale', None)
        # Remove pagination-related query parameters
        q_params.pop('limit', None)
        q_params.pop('offset', None)
        q_params.pop('page', None)
        search = q_params.pop('search', None)


        qs= super().get_queryset().filter(**q_params)


        if in_stock is not None:
            qs = qs.annotate(inventory_total=Sum('inventory__quantity'))
            if in_stock.lower() == 'true' or in_stock==1:
                qs= qs.filter(inventory_total__gt=0)
            else:
                qs= qs.filter(Q(inventory_total=None)or Q(inventory_total__lt=1))

        if on_sale is not None:
            if on_sale.lower()=='true' or on_sale==1:
                qs = qs.filter(sale_price__gt=0)
            else:
                qs = qs.filter(sale_price__lt=1)

        if category_id__in is not None:
            category_id__in = (category_id__in).split(',')

            qs = qs.filter(category_id__in=[int(i) for i in category_id__in])
        if search is not None:
            qs = qs.filter(Q(name__icontains=search ) or Q(description__icontains=search))
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