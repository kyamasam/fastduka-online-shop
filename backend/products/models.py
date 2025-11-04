from django.db import models
from django.db.models import Sum

from users.models import User, UtilColumnsModel


class CategoryType(UtilColumnsModel):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Category(UtilColumnsModel):
    name = models.CharField(max_length=255)
    category_type = models.ForeignKey(CategoryType, on_delete=models.SET_NULL, null=True, blank=True)
    parent = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True)
    photo = models.ImageField(null=True, blank=True)
    def __str__(self):
        return self.name
# Create your models here.
class Product (UtilColumnsModel):

    name = models.CharField(max_length=255)
    product_type = models.ForeignKey(CategoryType, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    seo_description = models.TextField(blank=True, null=True)
    additional_information = models.JSONField(blank=True, null=True,)  # [{ key:key, value: data}]
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    buying_price = models.FloatField(default=0)
    selling_price = models.FloatField()
    sale_price = models.FloatField(null=True, blank=True, default=0)
    primary_photo = models.ImageField( null=True, blank=True)
    allowable_discount = models.FloatField(null=True, blank=True)
    featured = models.BooleanField(default=False)

    @property
    def on_sale(self):
        return True if self.sale_price is not None and self.sale_price > 0 else False

    @property
    def in_stock(self):
        from inventory.models import Inventory
        return (Inventory.objects.filter(product=self).aggregate(sum=Sum("quantity"))["sum"] or 0)>0

    def __str__(self):
        return f"{self.name} @ {self.selling_price}"



# models.py changes
class ProductReview(UtilColumnsModel):
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    reviewer_name = models.CharField(max_length=255, blank=True, null=True)
    review_value = models.FloatField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        if self.user:
            reviewer = self.user.get_full_name() or self.user.email
        else:
            reviewer = self.reviewer_name or "Anonymous"
        return f"{self.title} {self.review_value} star review of {self.product} by {reviewer}"

class ProductPhoto(UtilColumnsModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    photo = models.ImageField(null=True)

    def __str__(self):
        return f"{self.product.name}'s photo"

class ProductVariant(UtilColumnsModel):
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    value = models.CharField(max_length=255) # eg XL
    buying_price = models.FloatField(null=True)
    selling_price = models.FloatField(null=True)
    sale_price = models.FloatField(null=True)
    allowable_discount = models.FloatField(null=True)

    def __str__(self):
        return self.value

class ProductVariantPhoto(UtilColumnsModel):
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    photo = models.ImageField(null=True)

    def __str__(self):
        return self.photo




