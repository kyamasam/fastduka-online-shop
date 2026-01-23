from django.contrib import admin

from inventory.models import Inventory, InventoryHistory

# Register your models here.


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ['product', 'product_variant', 'quantity', 'vendor']
    list_filter = ['quantity', 'vendor']
    search_fields = (
        'product__name',
        'vendor__name',
    )


admin.site.register(InventoryHistory)