from decimal import Decimal
from django.db import transaction
from rest_framework import serializers

from delivery.models import Rider
from orders.constants import ORDER_DELIVERED, ORDER_IN_TRANSIT, ORDER_PAID
from orders.models import Cart, CartItem, Order, OrderItem, Transaction
from orders.tax_utils import calculate_order_tax, validate_purchase_price
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
    product_variant_id = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all(), required=False)
    cart_id = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = CartItem
        fields = ["id", "cart_id", "product", "product_id", "product_variant", "product_variant_id", "quantity",
                  "purchase_price", "created_at", "updated_at"]

    def validate(self, attrs):
        """Validate that purchase_price meets minimum price requirements"""
        product = attrs.get('product_id')
        purchase_price = attrs.get('purchase_price')

        if product and purchase_price:
            try:
                validate_purchase_price(product, Decimal(str(purchase_price)))
            except ValueError as e:
                raise serializers.ValidationError({'purchase_price': str(e)})

        return attrs

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
    tax_breakdown = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "user", "cart_items", "tax_breakdown"]

    def get_tax_breakdown(self, obj):
        """
        Calculate and return tax breakdown for all cart items.
        Only included when context['include_tax'] is True.
        """
        if not self.context.get('include_tax', False):
            return None

        # Get all cart items
        cart_items = obj.cartitem_set.all()

        if not cart_items:
            return {
                'items': [],
                'tax_total': '0.00',
                'total_before_tax': '0.00',
                'total_after_tax': '0.00'
            }

        # Prepare items for tax calculation
        items_for_calc = []
        for cart_item in cart_items:
            items_for_calc.append({
                'product': cart_item.product,
                'quantity': cart_item.quantity,
                'purchase_price': Decimal(str(cart_item.purchase_price)),
                'cart_item_id': cart_item.id
            })

        # Calculate taxes
        tax_result = calculate_order_tax(items_for_calc)

        # Add cart_item_id to each item in the result
        for idx, item_data in enumerate(tax_result['items']):
            item_data['cart_item_id'] = items_for_calc[idx]['cart_item_id']

        return {
            'items': tax_result['items'],
            'tax_total': str(tax_result['tax_total']),
            'total_before_tax': str(tax_result['total_before_tax']),
            'total_after_tax': str(tax_result['total_after_tax'])
        }


class OrderItemSerializer(serializers.ModelSerializer):
    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), required=False)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product = ProductSerializer(read_only=True)
    product_variant_id = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all(), required=False)
    product_variant = ProductVariantSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["order", "order_id", "product", "product_id", "product_variant", "product_variant_id", "quantity",
                  "purchase_price", "tax_percent", "tax_amount", "total_before_tax", "total_after_tax"]

        read_only_fields = ["order", "tax_percent", "tax_amount", "total_before_tax", "total_after_tax"]

    def validate(self, attrs):
        """Validate that purchase_price meets minimum price requirements"""
        product = attrs.get('product_id')
        purchase_price = attrs.get('purchase_price')

        if product and purchase_price:
            try:
                validate_purchase_price(product, Decimal(str(purchase_price)))
            except ValueError as e:
                raise serializers.ValidationError({'purchase_price': str(e)})

        return attrs

    def create(self, validated_data):
        order = validated_data.pop('order_id')
        product = validated_data.pop('product_id')
        product_variant = validated_data.pop('product_variant_id', None)

        # Create the order item with the correct fields
        order_item = OrderItem.objects.create(order=order, product=product, **validated_data)

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
    delivery_latitude = serializers.FloatField(required=False, allow_null=True)
    delivery_longitude = serializers.FloatField(required=False, allow_null=True)
    vendor_obj = serializers.SerializerMethodField()

    def get_vendor_obj(self, obj):
        return VendorSerializer(obj.vendor).data
        
    def get_payment_transaction_obj(self, obj):

        return TransactionSerializer(obj.payment_transaction).data
    class Meta:
        model = Order
        fields = [ "user", "user_id", "status", "delivery_location","vendor","vendor_obj",
                  "delivery_latitude","delivery_longitude","payment_transaction","delivery_distance","delivery_duration",
                "orderitem_set", "created_at", "updated_at", "payment_transaction_obj", "id",
                "customer_signature", "rider_signature", "delivery_note", "delivery_completed_at", "order_client",
                "tax_total", "total_before_tax", "total_after_tax"]

    @transaction.atomic
    def create(self, validated_data):
        from vendors.models import VendorMember

        user = validated_data.pop("user_id", None)
        delivery_location = validated_data.pop("delivery_location", None)
        delivery_latitude = validated_data.pop("delivery_latitude", None)
        delivery_longitude = validated_data.pop("delivery_longitude", None)
        order_client = validated_data.get("order_client", "site")

        if user is None:
            user = self.context["request"].user
        order_items = validated_data.pop("orderitem_set")

        # Handle POS orders differently from site orders
        if order_client == "pos_web":
            # POS orders: in-store pickup, get vendor from user membership
            if not delivery_location:
                delivery_location = "In-Store Pickup"

            # Get vendor from user's membership
            vendor_membership = VendorMember.objects.filter(user=user).first()
            if vendor_membership:
                vendor_obj = vendor_membership.vendor
            else:
                # Fallback to first vendor or raise error
                vendor_obj = Vendor.objects.first()
                if not vendor_obj:
                    raise serializers.ValidationError("No vendor available for POS order")

            delivery_distance = None
            delivery_duration = None
        else:
            # Site orders: require delivery location and nearest vendor calculation
            if not delivery_latitude or not delivery_longitude:
                # Fail silently and select Nairobi default
                delivery_latitude = -1.286389
                delivery_longitude = 36.817223

            try:
                vendor_distance_data = find_nearest_vendor(delivery_latitude, delivery_longitude)
            except KeyError:
                raise serializers.ValidationError("Please Indicate a more specific location for us to find you")
            except Exception as e:
                raise serializers.ValidationError(str(e))

            vendor_obj = Vendor.objects.filter(pk=vendor_distance_data.get('id')).first()
            delivery_distance = vendor_distance_data.get('distance', None)
            delivery_duration = vendor_distance_data.get('duration', None)

        # Create order
        order = Order.objects.create(
            user=user,
            delivery_location=delivery_location,
            delivery_latitude=delivery_latitude,
            delivery_longitude=delivery_longitude,
            **validated_data
        )
        order.vendor = vendor_obj
        order.delivery_distance = delivery_distance
        order.delivery_duration = delivery_duration
        order.save()

        # Create order items and calculate taxes
        items_for_tax_calc = []
        created_order_items = []

        for order_item_data in order_items:
            product = order_item_data.pop("product_id")
            quantity = order_item_data.get("quantity")
            purchase_price = order_item_data.get("purchase_price")

            # Create order item
            order_item_obj = OrderItem.objects.create(
                order=order,
                product=product,
                **order_item_data
            )
            created_order_items.append(order_item_obj)

            # Prepare for tax calculation
            items_for_tax_calc.append({
                'product': product,
                'quantity': quantity,
                'purchase_price': Decimal(str(purchase_price)) if purchase_price else None
            })

        # Calculate taxes for all items
        tax_result = calculate_order_tax(items_for_tax_calc)

        # Update each order item with calculated tax values
        for idx, order_item_obj in enumerate(created_order_items):
            item_tax = tax_result['items'][idx]
            order_item_obj.tax_percent = item_tax['tax_percent']
            order_item_obj.tax_amount = item_tax['tax_amount']
            order_item_obj.total_before_tax = item_tax['total_before_tax']
            order_item_obj.total_after_tax = item_tax['total_after_tax']
            order_item_obj.save()

        # Update order with total tax values
        order.tax_total = tax_result['tax_total']
        order.total_before_tax = tax_result['total_before_tax']
        order.total_after_tax = tax_result['total_after_tax']
        order.save()

        return order

    def update(self, instance, validated_data):
        user = validated_data.pop("user_id", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

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
    delivered_by_name = serializers.CharField(required=False, allow_blank=True)
    status = serializers.CharField(required=False, allow_blank=True)
    delivery_location = serializers.CharField(required=False, allow_blank=True)
    customer_signature = serializers.CharField(required=False, allow_blank=True)
    rider_signature = serializers.CharField(required=False, allow_blank=True)
    delivery_note = serializers.CharField(required=False, allow_blank=True)


class POSTransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for creating POS transactions (specifically for cash payments).
    Allows creation of transactions with minimal required fields.
    """
    class Meta:
        model = Transaction
        fields = [
            'id',
            'customer_account_number',
            'transaction_amount',
            'transaction_currency',
            'payment_method',
            'transaction_code',
            'transaction_type',
            'transaction_status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Get user from request context
        user = self.context['request'].user
        validated_data['user'] = user

        # Create transaction
        transaction = Transaction.objects.create(**validated_data)
        return transaction


class CalculateTaxRequestItemSerializer(serializers.Serializer):
    """
    Serializer for individual items in a tax calculation request.
    """
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    quantity = serializers.IntegerField(min_value=1)
    purchase_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=True,
        help_text="Price per unit (must be >= selling_price - allowable_discount)"
    )

    def validate(self, attrs):
        """Validate that purchase_price meets minimum price requirements"""
        product = attrs['product_id']
        purchase_price = attrs['purchase_price']

        try:
            validate_purchase_price(product, purchase_price)
        except ValueError as e:
            raise serializers.ValidationError({'purchase_price': str(e)})

        return attrs


class CalculateTaxRequestSerializer(serializers.Serializer):
    """
    Serializer for tax calculation request containing multiple items.
    """
    items = CalculateTaxRequestItemSerializer(many=True)


class CalculateTaxResponseItemSerializer(serializers.Serializer):
    """
    Serializer for individual item tax calculation results.
    """
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    quantity = serializers.IntegerField()
    price_per_unit = serializers.DecimalField(max_digits=12, decimal_places=2)
    price_includes_tax = serializers.BooleanField()
    tax_rate = serializers.DecimalField(max_digits=5, decimal_places=4)
    tax_percent = serializers.FloatField()
    tax_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_before_tax = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_after_tax = serializers.DecimalField(max_digits=12, decimal_places=2)


class CalculateTaxResponseSerializer(serializers.Serializer):
    """
    Serializer for tax calculation response with totals and item breakdown.
    """
    items = CalculateTaxResponseItemSerializer(many=True)
    tax_total = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_before_tax = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_after_tax = serializers.DecimalField(max_digits=12, decimal_places=2)
