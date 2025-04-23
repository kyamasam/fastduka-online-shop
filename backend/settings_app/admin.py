from django.contrib import admin
from .models import SiteSettings

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = (
        'title', 
        'mpesa_paybill_number', 
        'maintenance_mode', 
        'match_user_to_closest_vendor'
    )
    search_fields = ('title', 'description')
