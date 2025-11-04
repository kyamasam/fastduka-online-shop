from django.db.models import Sum
from rest_framework import serializers

from inventory.models import Inventory
from products.models import Category, Product, ProductPhoto, ProductVariant, ProductVariantPhoto, ProductReview, CategoryType
from users.models import User
from django.db import transaction
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError


class CategoryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryType
        fields = ["id", "name", "description", "is_active", "created_at", "updated_at"]


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField(read_only=True)
    category_type = CategoryTypeSerializer(read_only=True)
    category_type_id = serializers.PrimaryKeyRelatedField(
        queryset=CategoryType.objects.all(), 
        write_only=True, 
        source='category_type'
    )
    parent_obj = serializers.SerializerMethodField(read_only=True)
    
    def get_parent_obj(self, obj):
        # Return the parent data if it exists
        if obj.parent is not None:
            val = Category.objects.filter(pk=obj.parent.id).first()
            if val is not None:
                return {
                    
                    "name":val.name,
                    }
            return None
        return None
    
    def get_children(self, obj):
        children = obj.category_set.all()
        return CategorySerializer(children, many=True).data

    class Meta:
        model = Category
        fields = [
            "id", "name", "parent", "parent_obj", "photo", 
            "children", "category_type", "category_type_id", 
            "created_at", "updated_at"
        ]
class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "product", "value", "buying_price", "selling_price", "sale_price", "allowable_discount",
                  "created_at", "updated_at"]


class ProductSerializer(serializers.ModelSerializer):
    variants = serializers.SerializerMethodField(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    product_type = CategoryTypeSerializer(read_only=True)
    product_type_id = serializers.PrimaryKeyRelatedField(queryset=CategoryType.objects.all(), write_only=True, source='product_type')
    photos = serializers.SerializerMethodField(read_only=True)
    inventory = serializers.SerializerMethodField(read_only=True)
    on_sale = serializers.SerializerMethodField(read_only=True)
    in_stock = serializers.SerializerMethodField(read_only=True)
    buying_price = serializers.FloatField(write_only=True, required=False)
    reviews = serializers.SerializerMethodField(read_only=True)
    review_stats = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ["id", "name","featured", "description","additional_information","seo_description", "primary_photo", "category", "category_id",
                  "product_type", "product_type_id", "selling_price", "sale_price", "allowable_discount", "on_sale", "in_stock", "variants", "photos", "inventory","reviews",
                  "created_at", "updated_at", "buying_price", "review_stats"]

    def get_in_stock(self, obj):
        return obj.in_stock

    def get_on_sale(self, obj):
        return obj.on_sale

    def get_variants(self, obj):
        variants = obj.productvariant_set.all()
        return ProductVariantSerializer(variants, many=True, read_only=True).data

    def get_inventory(self, obj):
        inv_count = Inventory.objects.filter(product=obj).aggregate(sum=Sum("quantity"))["sum"]
        return inv_count or 0

    def get_photos(self, obj):
        photos = obj.productphoto_set.all()
        return ProductPhotoSerializer(photos, many=True, read_only=True, context=self.context).data

    def create(self, validated_data):
        category = validated_data.pop("category_id")
        product_type = validated_data.pop("product_type")
        product = Product.objects.create(category=category, product_type=product_type, **validated_data)
        return product

    def update(self, instance, validated_data):
        category = validated_data.pop("category_id", None)
        product_type = validated_data.pop("product_type", None)

        # Update fields manually
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if category:
            instance.category = category
        if product_type:
            instance.product_type = product_type

        instance.save()
        return instance

    
    def get_reviews(self, obj):
        return ReviewSerializer(ProductReview.objects.filter(product=obj).order_by("-created_at"), many=True).data
    def get_review_stats(self, obj):
        from django.db.models import Avg, Count, Q

        stats = ProductReview.objects.filter(product=obj).aggregate(
            average_rating=Avg('review_value'),
            total_reviews=Count('id'),
            five_star=Count('id', filter=Q(review_value=5)),
            four_star=Count('id', filter=Q(review_value=4)),
            three_star=Count('id', filter=Q(review_value=3)),
            two_star=Count('id', filter=Q(review_value=2)),
            one_star=Count('id', filter=Q(review_value=1))
        )
        
        total = stats['total_reviews'] or 1  # Avoid division by zero
        
        return {
            'average_rating': round(stats['average_rating'] or 0, 1),
            'total_reviews': stats['total_reviews'] or 0,
            'rating_display': f"{stats['average_rating'] or 0:.1f}/5.0 ({stats['total_reviews']} {'review' if stats['total_reviews'] == 1 else 'reviews'})",
            'rating_breakdown': {
                '5': {
                    'count': stats['five_star'],
                    'percentage': round((stats['five_star'] / total) * 100, 1)
                },
                '4': {
                    'count': stats['four_star'],
                    'percentage': round((stats['four_star'] / total) * 100, 1)
                },
                '3': {
                    'count': stats['three_star'],
                    'percentage': round((stats['three_star'] / total) * 100, 1)
                },
                '2': {
                    'count': stats['two_star'],
                    'percentage': round((stats['two_star'] / total) * 100, 1)
                },
                '1': {
                    'count': stats['one_star'],
                    'percentage': round((stats['one_star'] / total) * 100, 1)
                }
            }
        }

class ProductPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPhoto
        fields = ["id", "product", "photo", "created_at", "updated_at"]


class ProductVariantPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariantPhoto
        fields = ["id", "product_variant", "photo", "created_at", "updated_at"]




class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user information for nested serialization"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name','avatar']
class ReviewSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True, required=True)
    name = serializers.CharField(write_only=True, required=True)
    phone_number = serializers.CharField(write_only=True, required=False)
    phone_code = serializers.CharField(write_only=True, required=False)
    create_account = serializers.BooleanField(write_only=True, required=False, default=False)
    
    user = UserMinimalSerializer(read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Product.objects.all(),
        source='product'
    )

    class Meta:
        model = ProductReview
        fields = [
            'id', 
            'title', 
            'description', 
            'product_name',
            'product_id',
            'review_value',
            'user',
            'reviewer_name',
            'email',
            'name',
            'phone_number',
            'phone_code',
            'create_account',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'user', 'reviewer_name']

    def validate_review_value(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError("Review value must be between 0 and 5")
        return value

    def validate_email(self, value):
        try:
            EmailValidator()(value)
            return value.lower()
        except ValidationError:
            raise serializers.ValidationError("Invalid email format")

    def validate(self, attrs):
        if not attrs.get('title'):
            raise serializers.ValidationError("Title is required")
        
        if not attrs.get('description') and not attrs.get('review_value'):
            raise serializers.ValidationError(
                "Either description or review value must be provided"
            )

        # Validate create_account related fields
        if attrs.get('create_account'):
            if (str(attrs.get('create_account'))).lower() == 'true' or str(attrs.get('create_account')) == '1':
                if not attrs.get('phone_number'):
                    raise serializers.ValidationError("Phone number is required when creating an account")
                if not attrs.get('phone_code'):
                    raise serializers.ValidationError("Phone code is required when creating an account")

        return attrs
    @transaction.atomic
    def create(self, validated_data):
        email = validated_data.pop('email')
        name = validated_data.pop('name')
        create_account = validated_data.pop('create_account', False)
        phone_number = validated_data.pop('phone_number', None)
        phone_code = validated_data.pop('phone_code', None)

        # Try to find existing user
        user = User.objects.filter(email=email).first()

        if user:
            # User exists, associate review with this user
            validated_data['user'] = user
            validated_data['reviewer_name'] = None
        elif create_account and phone_number and phone_code:
            # Create new user
            user = User.objects.create_user(
                email=email,
                phone_number=phone_number,
                phone_code=phone_code,
                first_name=name.split()[0] if ' ' in name else name,
                last_name=name.split()[-1] if ' ' in name else '',
            )
            validated_data['user'] = user
            validated_data['reviewer_name'] = None
        else:
            # Anonymous review
            validated_data['user'] = None
            validated_data['reviewer_name'] = name

        return super().create(validated_data)