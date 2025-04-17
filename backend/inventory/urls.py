from rest_framework.routers import DefaultRouter

from inventory import views

core_router = DefaultRouter()
core_router.register(r'inventory', views.InventoryViewSet, basename='inventory')
core_router.register(r'inventory-history', views.InventoryHistoryViewSet, basename='inventory-history')
url_patterns = core_router.urls

url_patterns += [

]