from django.db import transaction
from rest_framework import serializers

from delivery.models import Rider
from orders.constants import ORDER_DELIVERED, ORDER_IN_TRANSIT, ORDER_PAID
from orders.models import Cart, CartItem, Order, OrderItem, Transaction
from products.models import ProductVariant, Product
from products.serializers import ProductVariantSerializer, ProductSerializer
from users.models import User
from users.serializers import UserSerializer
from vendors.models import Vendor
from vendors.serializers import VendorSerializer
from vendors.utils.find_nearest import find_nearest_vendor


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    product_variant = ProductVariantSerializer(read_only=True)
    product_variant_id = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all())
    cart_id = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())
    product = ProductVariantSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    
    class Meta:
        model = CartItem
        fields = ["id", "cart_id", "product","vendor", "product_id", "product_variant", "product_variant_id", "quantity",
                  "purchase_price", "created_at", "updated_at"]

    def create(self, validated_data):
        product_variant = validated_data.pop("product_variant_id", None)
        cart = validated_data.pop("cart_id")
        product = validated_data.pop("product_id")

        cart_item = CartItem.objects.create(cart=cart, product=product, **validated_data)
        if product_variant:
            cart_item.product_variant = product_variant
            cart_item.save()
        return cart_item

    def update(self, instance, validated_data):
        product_variant = validated_data.pop("product_variant_id", None)
        cart = validated_data.pop("cart_id", None)
        product = validated_data.pop("product_id", None)

        instance.update(validated_data)
        if product_variant:
            instance.product_variant = product_variant
        if cart:
            instance.cart = cart
        if product:
            instance.product = product
        instance.save()
        return instance


class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["user", "cart_items"]


class OrderItemSerializer(serializers.ModelSerializer):
    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), required=False)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product = ProductSerializer(read_only=True)
    product_variant_id = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all(), required=False)
    product_variant = ProductVariantSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["order", "order_id", "product", "product_id", "product_variant", "product_variant_id", "quantity",
                  "purchase_price"]

        read_only_fields = ["order"]

    def create(self, validated_data):
        order = validated_data.pop('order_id')
        product = validated_data.pop('product_id')
        product_variant = validated_data.pop('product_variant_id', None)

        # Create the order item with the correct fields
        order_item = OrderItem.objects.create(order=order, **validated_data)

        # If product_variant exists, assign it and save the order_item
        if product_variant:
            order_item.product_variant = product_variant
            order_item.save()

        return order_item

    def update(self, instance, validated_data):
        order = validated_data.pop('order_id', None)
        product = validated_data.pop('product_id', None)
        product_variant = validated_data.pop('product_variant_id', None)

        instance.update(validated_data)
        if order:
            instance.order = order
        if product:
            instance.product = product
        if product_variant:
            instance.product_variant = product_variant
        instance.save()
        return instance


class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    orderitem_set = OrderItemSerializer(many=True, )
    payment_transaction_obj = serializers.SerializerMethodField()
    delivery_latitude = serializers.FloatField()
    delivery_longitude = serializers.FloatField()
    vendor_obj = serializers.SerializerMethodField()

    def get_vendor_obj(self, obj):
        return VendorSerializer(obj.vendor).data
        
    def get_payment_transaction_obj(self, obj):

        return TransactionSerializer(obj.payment_transaction).data
    class Meta:
        model = Order
        fields = [ "user", "user_id", "status", "delivery_location","vendor","vendor_obj",
                  "delivery_latitude","delivery_longitude","payment_transaction","delivery_distance","delivery_duration",
                "orderitem_set", "created_at", "updated_at", "payment_transaction_obj", "id"]

    @transaction.atomic
    def create(self, validated_data):
        user = validated_data.pop("user_id", None)
        delivery_location = validated_data.pop("delivery_location", None)
        # fail silently and select Nairobi
        delivery_latitude = validated_data.pop("delivery_latitude",  -1.286389)
        delivery_longitude = validated_data.pop("delivery_longitude", 36.817223)

        if user is None:
            user = self.context["request"].user
        order_items = validated_data.pop("orderitem_set")
        # assign vendor
        try:
            vendor_distance_data = find_nearest_vendor(delivery_latitude, delivery_longitude)
        except KeyError:
            raise serializers.ValidationError("Please Indicate a more specific location for us to find you")
        except Exception as e:
            raise serializers.ValidationError(str(e))

        vendor_obj = Vendor.objects.filter(pk=vendor_distance_data.get('id')).first()
        order = Order.objects.create(user=user,delivery_location=delivery_location, **validated_data)
        order.vendor=vendor_obj
        order.delivery_distance=vendor_distance_data.get('distance', None)
        order.delivery_duration=vendor_distance_data.get('duration', None)
        order.save()

        for order_item in order_items:
            product = order_item.pop("product_id")
            OrderItem.objects.create(order=order, product_id=product.id, **order_item)

        return order

    def update(self, instance, validated_data):
        user = validated_data.pop("user_id", None)

        instance.update(validated_data)

        if user:
            instance.user = user
        instance.save()
        return instance


class OrderStkSerializer(serializers.Serializer):
    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())
    phone_number = serializers.CharField()
    amount = serializers.FloatField()


class ConfirmPaymentSerializer(serializers.Serializer):
    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())
    transaction_id = serializers.PrimaryKeyRelatedField(queryset=Transaction.objects.all())

class TransactionSerializer(serializers.ModelSerializer):

    customer_name = serializers.SerializerMethodField()
    class Meta:
        model = Transaction
        fields = [
            'id',
            'customer_account_number',
            'transaction_amount',
            'transaction_currency',
            'payment_method',
            'transaction_identifier',
            'transaction_code',
            'customer_name',
            'transaction_type',
            'transaction_status',
            'transaction_initial_response',
            'transaction_callback_response',
            'utilised',
            'created_at',  # Assuming this comes from UtilColumnsModel
            'updated_at'   # Assuming this comes from UtilColumnsModel
        ]
        read_only_fields = fields  # Make all fields read-only

    def get_customer_name(self, obj):
        return obj.user.get_full_name()


class AssignOrderToRiderSerializer(serializers.Serializer):
    order_id = serializers.PrimaryKeyRelatedField(queryset = Order.objects.all())
    rider_id = serializers.PrimaryKeyRelatedField(queryset=Rider.objects.all())
    delivery_notes = serializers.CharField(max_length=5000, required=False)


    def validate(self, attrs):
        order = attrs.get('order_id')
        rider = attrs.get('rider_id')
        if order.status != ORDER_PAID:
            raise serializers.ValidationError(f"Order must be in status {ORDER_PAID}")
        # check if rider has an order that has not been delivered or cancelled

        ongoing_orders_count = Order.objects.filter(status=ORDER_IN_TRANSIT, rider=rider).count()
        if ongoing_orders_count >0:
            raise serializers.ValidationError("Rider currently has ongoing orders") 
        

        return super().validate(attrs)
    


class OrderDeliverySerializer(serializers.Serializer):
    customer_signature = serializers.CharField(required=True)
    rider_signature = serializers.CharField(required=True)
