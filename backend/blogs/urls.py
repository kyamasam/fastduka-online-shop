from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogViewSet, BlogCategoryViewSet

router = DefaultRouter()
router.register(r'blogs', BlogViewSet, basename='blog')
router.register(r'blog-categories', BlogCategoryViewSet, basename='blogcategory')

url_patterns = [
    path('', include(router.urls)),
]
