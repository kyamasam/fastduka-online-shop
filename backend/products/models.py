from django.db import models
from django.db.models import Sum
from decimal import Decimal
from users.models import User, UtilColumnsModel


class TaxRate(UtilColumnsModel):
    """
    Model to store tax rates that can be applied to products.
    Rates are stored as decimals (0.16 for 16%).
    """
    name = models.CharField(max_length=100, unique=True, help_text="e.g., 'Standard VAT', 'Reduced Rate'")
    rate = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        help_text="Tax rate as decimal (0.16 for 16%)"
    )
    description = models.TextField(blank=True, null=True, help_text="Optional description of this tax rate")
    is_default = models.BooleanField(default=False, help_text="Is this the default tax rate?")
    is_active = models.BooleanField(default=True, help_text="Is this tax rate active?")

    class Meta:
        ordering = ['-is_default', 'rate']
        verbose_name = "Tax Rate"
        verbose_name_plural = "Tax Rates"

    def __str__(self):
        percentage = float(self.rate) * 100
        return f"{self.name} ({percentage}%)"

    def save(self, *args, **kwargs):
        # Ensure only one default tax rate
        if self.is_default:
            TaxRate.objects.filter(is_default=True).update(is_default=False)
        super().save(*args, **kwargs)

    @property
    def display_rate(self):
        """Return rate as percentage string (e.g., '16%')"""
        return f"{float(self.rate) * 100}%"


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
    sku = models.CharField(max_length=100, blank=True, null=True, unique=True, db_index=True)
    product_type = models.ForeignKey(CategoryType, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    seo_description = models.TextField(blank=True, null=True)
    additional_information = models.JSONField(blank=True, null=True,)  # [{ key:key, value: data}]
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    buying_price = models.FloatField(default=0)
    selling_price = models.FloatField()
    is_taxable=models.BooleanField(default=True)
    price_includes_tax = models.BooleanField(default=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=4, default=Decimal(0.16))
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




