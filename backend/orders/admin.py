from django.contrib import admin

from orders.models import Cart, CartItem, Order, OrderItem, Transaction

# Register your models here.


admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Transaction)
