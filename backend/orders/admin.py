from django.contrib import admin

from orders.models import Cart, CartItem, Order, OrderItem, Transaction

# Register your models here.


admin.site.register(Cart)
admin.site.register(CartItem)
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'status',
        'delivery_location_type',
        'delivery_location',
        'delivery_fee',
        'grand_total',
        'vendor',
        'created_at',
    )
    list_filter = ('status', 'delivery_location_type', 'is_guest', 'vendor')
    search_fields = (
        'id',
        'user__email',
        'delivery_location',
        'predefined_delivery_location__name',
        'predefined_delivery_location__city__name',
    )
    autocomplete_fields = ('predefined_delivery_location',)
    raw_id_fields = ('user', 'vendor')
    readonly_fields = (
        'delivery_fee',
        'grand_total',
        'tax_total',
        'total_before_tax',
        'total_after_tax',
        'delivery_distance',
        'delivery_duration',
        'created_at',
        'updated_at',
    )
    list_select_related = ('user', 'vendor', 'predefined_delivery_location')
admin.site.register(OrderItem)
admin.site.register(Transaction)
