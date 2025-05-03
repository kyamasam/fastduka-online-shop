from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteSettingsViewSet

router = DefaultRouter()
router.register(r'settings', SiteSettingsViewSet, basename='settings')

url_patterns = [
    path('', include(router.urls)),
]