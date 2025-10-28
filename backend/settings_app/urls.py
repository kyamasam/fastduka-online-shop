from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteSettingsViewSet, HeroSliderViewSet

router = DefaultRouter()
router.register(r'settings', SiteSettingsViewSet, basename='settings')
router.register(r'hero-sliders', HeroSliderViewSet, basename='hero-sliders')

url_patterns = [
    path('', include(router.urls)),
]