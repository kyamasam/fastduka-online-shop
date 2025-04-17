from rest_framework.routers import DefaultRouter
from django.urls import path, include

from vendors.views import VendorViewSet

router = DefaultRouter()
router.register(r'vendors', VendorViewSet, basename='vendor')

url_patterns = [
    path('', include(router.urls)),
]