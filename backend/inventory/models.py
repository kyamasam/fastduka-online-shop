from django.db import models

from inventory.constants import CUSTOMER_ORDER, IN_TRANSIT, STOCK_ADDITION, STOCK_DEDUCTION, EXPIRY, ORDER_CANCELLED
from products.models import Product, ProductVariant
from users.models import UtilColumnsModel
from vendors.models import Vendor


class ActiveInventoryManager(models.Manager):
    """Manager that returns only non-expired inventory"""
    def get_queryset(self):
        return super().get_queryset().filter(is_expired=False)


class Inventory(UtilColumnsModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.FloatField(default=0)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, null=True, blank=True)
    is_expired = models.BooleanField(default=False)

    # Default manager returns only non-expired inventory
    objects = ActiveInventoryManager()
    # Manager to access all inventory including expired
    objects_all = models.Manager()

    def __str__(self):
        return f"inventory for {self.product} {self.quantity},  left"


class InventoryHistory(UtilColumnsModel):
    action_types = [
        (CUSTOMER_ORDER, "Customer Order"),
                    (STOCK_ADDITION, "Stock Addition"),
                    (STOCK_DEDUCTION, "Stock Deduction"),
                    (ORDER_CANCELLED, "Cancellation"),
                    (IN_TRANSIT, "In Transit"),
                    (EXPIRY, "Expiry")]
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    reference_id = models.CharField(max_length=255, null=True, blank=True) # 1
    reference_type = models.CharField(max_length=255, null=True, blank=True) # order
    previous_value= models.FloatField(default=0)
    new_value = models.FloatField(default=0)
    quantity = models.FloatField(default=0)  # Amount added or reduced (always positive)
    action_type = models.CharField(max_length=255, null=True, blank=True, choices=action_types)
    reason = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"History for {self.inventory.product} inventory id {self.inventory.id}"
