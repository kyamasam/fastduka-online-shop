import django_filters
from .models import Blog, BlogCategory
from django.db import models

class BlogFilter(django_filters.FilterSet):
    category = django_filters.ModelChoiceFilter(
        queryset=BlogCategory.objects.all(),
        field_name='category',
        lookup_expr='exact'
    )
    author = django_filters.ModelChoiceFilter(
        queryset=Blog.objects.values_list('author', flat=True).distinct(),
        field_name='author',
        lookup_expr='exact'
    )
    created_after = django_filters.DateFilter(
        field_name='created_at', 
        lookup_expr='gte'
    )
    created_before = django_filters.DateFilter(
        field_name='created_at', 
        lookup_expr='lte'
    )
    search = django_filters.CharFilter(
        method='filter_search'
    )
    
    class Meta:
        model = Blog
        fields = ['category', 'author']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value) |
            models.Q(content__icontains=value) |
            models.Q(author__email__icontains=value)
        )

class BlogCategoryFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = BlogCategory
        fields = ['name']