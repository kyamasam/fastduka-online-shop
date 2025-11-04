from os.path import basename

from rest_framework.routers import DefaultRouter

from products.views import CategoryViewSet, CategoryTypeViewSet, ProductVariantPhotoViewSet, ProductPhotoViewSet, ProductVariantViewSet, \
    ProductViewSet, ReviewViewSet

core_router = DefaultRouter()

core_router.register(r"category-type", CategoryTypeViewSet, basename="category-type")
core_router.register(r"category",CategoryViewSet, basename="category")
core_router.register(r"product",ProductViewSet, basename="product")
core_router.register(r"product-photo", ProductPhotoViewSet, basename="product-photo")
core_router.register(r"product-variant", ProductVariantViewSet, basename="product-variant")
core_router.register(r"product-variant-photo", ProductVariantPhotoViewSet, basename="product-variant-photo")
core_router.register(r'reviews', ReviewViewSet, basename="reviews")

url_patterns = core_router.urls

url_patterns += [

]