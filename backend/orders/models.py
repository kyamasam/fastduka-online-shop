from django.core.validators import MaxValueValidator
from django.db import models

from delivery.models import Rider
from orders.constants import ORDER_CANCELLED, ORDER_PLACED, ORDER_PROCESSING, ORDER_IN_TRANSIT, ORDER_DELIVERED, ORDER_PAID
from products.models import Product, ProductVariant
from users.models import UtilColumnsModel, User
from vendors.models import Vendor

PAYMENT_METHOD_CHOICES = (("mpesa", "M-Pesa"), ("wallet", "Wallet"))
PROCESSED ='processed'
FAILED = 'failed'
TRANSACTION_STATUS_CHOICES = [(ORDER_PROCESSING, "Processing"), (PROCESSED, "Processed"), (FAILED, "Failed"), ]
SUPPORTED_CURRENCY_CHOICES =[('KES', 'Kenya Shillings')]
WITHDRAWAL = 'withdrawal'
PURCHASE = 'purchase'
TRANSACTION_TYPE_CHOICES = (
    (WITHDRAWAL, "Withdrawal"), (PURCHASE, "Purchase"),)
class Transaction(UtilColumnsModel):
    id = models.AutoField(primary_key=True)
    customer_account_number = models.CharField(max_length=20, null=True)
    transaction_amount = models.FloatField(validators=[MaxValueValidator(250000)])
    transaction_currency = models.CharField(max_length=40, choices=SUPPORTED_CURRENCY_CHOICES, default="KES")
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES, default='mpesa')
    transaction_identifier = models.CharField(max_length=255, unique=True, null=True)  # idempotency_key from mpesa
    transaction_code = models.CharField(max_length=255, unique=True,
        null=True)  # Mpesa code after a payment is complete
    user = models.ForeignKey(User, on_delete=models.PROTECT)  # should take the current logged in user
    transaction_type = models.CharField(max_length=100, choices=TRANSACTION_TYPE_CHOICES)
    transaction_status = models.CharField(max_length=20, choices=TRANSACTION_STATUS_CHOICES, default=ORDER_PROCESSING)
    transaction_initial_response = models.JSONField(null=True, blank=True)
    transaction_callback_response = models.JSONField(null=True, blank=True)
    # add column to specify if transaction has already been utilised
    utilised = models.BooleanField(default=False)

    def __str__(self):
        return f"Transaction ID: {self.id} - {self.transaction_type} by {self.customer_account_number} status {self.transaction_status} code {self.transaction_code}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-id']

# Create your models here.
class Cart(UtilColumnsModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username}'s Cart"


class CartItem(UtilColumnsModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(default=1)
    purchase_price = models.FloatField()
    


    def __str__(self):
        return f"{self.quantity} {self.product.name} in {self.cart.user.get_full_name() or self.cart.user.username}'s Cart"


class Order(UtilColumnsModel):
    order_status_choices = (
            (ORDER_PLACED, "Placed"), 
            (ORDER_PROCESSING, "Processing"),
            (ORDER_IN_TRANSIT, "In Transit"),
            (ORDER_DELIVERED, "Delivered"), 
            (ORDER_CANCELLED, "Cancelled"), 
            (ORDER_PAID, "Paid")
         )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, default=ORDER_PLACED, choices=order_status_choices)
    delivery_location = models.CharField(max_length=255)
    delivery_latitude = models.FloatField(null=True)
    delivery_longitude = models.FloatField(null=True)
    delivery_location = models.CharField(max_length=255)
    delivery_duration = models.CharField(max_length=255, null=True, blank=True)
    delivery_distance = models.FloatField(null=True, blank=True)
    payment_transaction = models.ForeignKey(Transaction, on_delete=models.SET_NULL, null=True, blank=True)
    rider =  models.ForeignKey(Rider, on_delete=models.SET_NULL, null=True, blank=True)
    delivery_notes = models.TextField(blank=True, null=True)
    # add vendor
    vendor = models.ForeignKey(Vendor, null=True, blank=True, on_delete=models.SET_NULL)

    customer_signature = models.TextField(null=True, blank=True)
    rider_signature = models.TextField(null=True, blank=True)
    delivery_completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(null=True, blank=True)
    

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username}'s Order in {self.status}"


class OrderItem(UtilColumnsModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.IntegerField(default=1)
    purchase_price = models.FloatField()


