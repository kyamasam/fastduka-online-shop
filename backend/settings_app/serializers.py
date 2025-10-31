from rest_framework import serializers
from .models import SiteSettings, HeroSlider

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class HeroSliderSerializer(serializers.ModelSerializer):
    background_image_url = serializers.SerializerMethodField()

    class Meta:
        model = HeroSlider
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_background_image_url(self, obj):
        if obj.background_image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.background_image.url)
            return obj.background_image.url
        return None