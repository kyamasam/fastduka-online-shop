from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Blog, BlogCategory
from .serializers import (
    BlogCategorySerializer, 
    BlogListSerializer, 
    BlogDetailSerializer, 
    BlogCreateSerializer,
    BlogUpdateSerializer
)
from .filters import BlogFilter, BlogCategoryFilter

class IsAuthenticatedForWrite(permissions.BasePermission):
    """
    Custom permission to allow read-only access to all users,
    but require authentication for write operations.
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # Require authentication for POST, PUT, PATCH, DELETE
        return request.user and request.user.is_authenticated

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner
        return obj.author == request.user

class BlogCategoryViewSet(viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    authentication_classes=[]
    permission_classes = [IsAuthenticatedForWrite]  # Read for all, write for authenticated
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = BlogCategoryFilter
    search_fields = ['name']
    ordering_fields = ['name', 'created_at', 'updated_at']
    ordering = ['name']

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    authentication_classes=[]
    permission_classes = [IsAuthenticatedForWrite, IsOwnerOrReadOnly]  # Combined permissions
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = BlogFilter
    search_fields = ['title', 'content', 'author__email']
    ordering_fields = ['title', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BlogCreateSerializer
        elif self.action == 'list':
            return BlogListSerializer
        elif self.action in ['update', 'partial_update']:
            return BlogUpdateSerializer
        elif self.action == 'retrieve':
            return BlogDetailSerializer
        return BlogDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.select_related('author', 'category')
        return queryset
    
    def get_permissions(self):
        """
        Override to use different permissions for different actions.
        """
        if self.action == 'my_blogs':
            # Only authenticated users can access my_blogs
            return [permissions.IsAuthenticated()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_blogs(self, request):
        """Get blogs written by the current user - requires authentication"""
        user_blogs = self.get_queryset().filter(author=request.user)
        page = self.paginate_queryset(user_blogs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(user_blogs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get blogs by category ID via query parameter - available to all"""
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response(
                {"error": "category_id parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            blogs = self.get_queryset().filter(category_id=category_id)
            page = self.paginate_queryset(blogs)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(blogs, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response(
                {"error": "Invalid category_id"}, 
                status=status.HTTP_400_BAD_REQUEST
            )