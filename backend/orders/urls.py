from rest_framework.routers import DefaultRouter

from orders import views

core_router = DefaultRouter()

core_router.register(r'transaction', views.TransactionViewSet, basename='transaction')
core_router.register(r'order', views.OrderViewSet, basename='order')
core_router.register(r'order-item', views.OrderItemViewSet, basename='order-item')
url_patterns = core_router.urls

url_patterns += [

]
