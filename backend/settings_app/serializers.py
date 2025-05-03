from rest_framework import serializers
from .models import SiteSettings

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']