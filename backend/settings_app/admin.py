from django.contrib import admin
from .models import SiteSettings, HeroSlider

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = (
        'title', 
        'mpesa_paybill_number', 
        'maintenance_mode', 
        'match_user_to_closest_vendor'
    )
    search_fields = ('title', 'description')


@admin.register(HeroSlider)
class HeroSliderAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'subtitle',
        'order',
        'is_active',
        'created_at'
    )
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'subtitle', 'description')
    ordering = ('order', 'created_at')
    list_editable = ('order', 'is_active')

    fieldsets = (
        ('Content', {
            'fields': ('title', 'subtitle', 'description')
        }),
        ('Button', {
            'fields': ('button_text', 'button_link')
        }),
        ('Image', {
            'fields': ('background_image',)
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )
