from django.db import models

from inventory.constants import CUSTOMER_ORDER, STOCK_ADDITION, EXPIRY
from products.models import Product, ProductVariant
from users.models import UtilColumnsModel
from vendors.models import Vendor

class Inventory(UtilColumnsModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.FloatField(default=0)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return f"inventory for {self.product} {self.quantity},  left"


class InventoryHistory(UtilColumnsModel):
    action_types = [
        (CUSTOMER_ORDER, "Customer Order"),
                    (STOCK_ADDITION, "Stock Addition"),
                    (EXPIRY, "Expiry")]
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    reference_id = models.CharField(max_length=255, null=True, blank=True)
    previous_value= models.FloatField(default=0)
    new_value = models.FloatField(default=0)
    action_type = models.CharField(max_length=255, null=True, blank=True, choices=action_types)

    def __str__(self):
        return f"History for {self.inventory.product} inventory id {self.inventory.id}"
