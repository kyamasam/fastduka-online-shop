from django.contrib import admin
from .models import Blog, BlogCategory
from django_tiptap.fields import TipTapTextField
from django.utils.html import format_html

@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at", "updated_at")  
    search_fields = ("name",)

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "created_at", "updated_at", "cover_photo_preview")
    list_filter = ("category", "author", "created_at")
    search_fields = ("title", "content", "author__username")
    prepopulated_fields = {"slug": ("title",)}  
    readonly_fields = ("created_at", "updated_at")
    autocomplete_fields = ("author", "category")
    

    class Media:
        css = {
            'all': ('django_tiptap/django-tiptap.css',)
        }
        js = (
            'django_tiptap/tiptap-bundle.js',
        )

    def cover_photo_preview(self, obj):
        if obj.cover_photo:
            return format_html('<img src="{}" style="max-height: 200px; max-width: 200px;" />', obj.cover_photo.url)
        return "No cover photo"
    cover_photo_preview.short_description = "Cover Photo Preview"

    class Media:
        css = {
            'all': (
                'django_tiptap/django-tiptap.css',
            )
        }
        js = (
            'admin/js/vendor/jquery/jquery.js',  
            'admin/js/jquery.init.js',
            'django_tiptap/tiptap-bundle.js',
        )
