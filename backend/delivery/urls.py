from rest_framework.routers import DefaultRouter
from django.urls import path, include

from delivery.views.rider_views import RiderViewSet
from delivery.views.location_views import DeliveryCityViewSet, DeliveryLocationViewSet
router = DefaultRouter()
router.register(r'rider', RiderViewSet, basename='riders')
router.register(r'delivery-cities', DeliveryCityViewSet, basename='delivery-cities')
router.register(r'delivery-locations', DeliveryLocationViewSet, basename='delivery-locations')

url_patterns = router.urls

url_patterns += [

]
