from django.contrib import admin

from products.models import Product, Category, ProductPhoto, ProductVariant, ProductVariantPhoto, ProductReview

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(ProductPhoto)
admin.site.register(ProductVariant)
admin.site.register(ProductVariantPhoto)
admin.site.register(ProductReview)
