from rest_framework import serializers
from .models import Blog, BlogCategory
from users.models import User

class MiniUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name')
        read_only_fields = fields

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class BlogListSerializer(serializers.ModelSerializer):
    author = MiniUserSerializer(read_only=True)
    category = BlogCategorySerializer(read_only=True)
    
    class Meta:
        model = Blog
        fields = ('id', 'title', 'slug', 'cover_photo', 'author', 'category', 
                 'created_at', 'updated_at')

class BlogDetailSerializer(serializers.ModelSerializer):
    author = MiniUserSerializer(read_only=True)
    category = BlogCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=BlogCategory.objects.all(), 
        source='category', 
        write_only=True
    )
    
    class Meta:
        model = Blog
        fields = ('id', 'title', 'slug', 'cover_photo', 'content', 
                 'author', 'category', 'category_id', 'created_at', 'updated_at')
        read_only_fields = ('slug', 'created_at', 'updated_at')

class BlogCreateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=BlogCategory.objects.all(), 
        source='category', 
        write_only=True
    )
    
    class Meta:
        model = Blog
        fields = ('title', 'cover_photo', 'content', 'category_id')
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

class BlogUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=BlogCategory.objects.all(), 
        source='category', 
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Blog
        fields = ('title', 'cover_photo', 'content', 'category_id')
        extra_kwargs = {
            'title': {'required': False},
            'cover_photo': {'required': False},
            'content': {'required': False},
        }