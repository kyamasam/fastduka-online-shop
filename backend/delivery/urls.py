from rest_framework.routers import DefaultRouter
from django.urls import path, include

from delivery.views.rider_views import RiderViewSet
router = DefaultRouter()
router.register(r'rider', RiderViewSet, basename='riders')

url_patterns = router.urls

url_patterns += [

]