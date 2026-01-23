from rest_framework import serializers

from products.models import Product
from products.serializers import MiniProductSerializer, ProductSerializer
from inventory.models import Inventory, InventoryHistory
from inventory.constants import CUSTOMER_ORDER, STOCK_ADDITION, STOCK_DEDUCTION, ORDER_CANCELLED, IN_TRANSIT, EXPIRY
from vendors.models import Vendor, VendorMember
from vendors.serializers import VendorSerializer
from vendors.constants import VENDOR_ROLE_ADMIN
class InventorySerializer(serializers.ModelSerializer):
    vendor_id = serializers.PrimaryKeyRelatedField(queryset=Vendor.objects.all(), write_only=True)
    vendor =  VendorSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True)
    product = MiniProductSerializer(read_only=True)
    class Meta:
        model = Inventory
        fields = [
            "id",
            "product",
            "product_id",
            "product_variant",
            "quantity",
            "vendor_id",
            "vendor",
            "created_at",
            "updated_at"
        ]
    def validate(self, attrs):
        vendor_id = attrs.get('vendor_id', None)
        if vendor_id is None:
            raise serializers.ValidationError("Vendor Id is required")
     
        return super().validate(attrs)
    def create(self, validated_data):
        product = validated_data.pop("product")
        vendor = validated_data.pop("vendor_id")
        product_variant = validated_data.pop("product_variant", None)
        quantity = validated_data.pop("quantity")

        inv = Inventory.objects.create(product=product, quantity=quantity, vendor=vendor)
        inv.save()
        if product_variant:
            inv.product_variant = product_variant
            inv.save()
        return inv
    def update(self, instance, validated_data):
        product = validated_data.pop("product", None)
        product_variant = validated_data.pop("product_variant", None)
        quantity = validated_data.pop("quantity")


        instance.product_variant = product_variant
        instance.product = product
        instance.quantity = quantity
        instance.save()
        return instance




class InventoryHistorySerializer(serializers.ModelSerializer):
    inventory_id = serializers.PrimaryKeyRelatedField( queryset=Inventory.objects.all())
    class Meta:
        model = InventoryHistory
        fields = [
            "inventory",
            "inventory_id",
            "reference_id",
            "reference_type",
            "previous_value",
            "new_value",
            "quantity",
            "action_type",
            "reason"
        ]


    def create(self, validated_data):
        inventory = validated_data.pop("inventory_id")
        inventory_history = InventoryHistory.objects.create(inventory=inventory, **validated_data)
        inventory_history.inventory = inventory

        return inventory_history

    def update(self, instance, validated_data):
        inventory = validated_data.pop("inventory_id", None)
        instance.update(**validated_data)
        instance.inventory = inventory
        instance.save()
        return instance


class InventoryAdjustmentSerializer(serializers.Serializer):
    """
    Serializer for inventory adjustment requests.
    """
    product_id = serializers.IntegerField(required=True)
    vendor_id = serializers.IntegerField(required=True)
    quantity = serializers.FloatField(required=True, min_value=0.01)
    action_type = serializers.ChoiceField(
        required=True,
        choices=[
            (CUSTOMER_ORDER, "Customer Order"),
            (STOCK_ADDITION, "Stock Addition"),
            (STOCK_DEDUCTION, "Stock Deduction"),
            (ORDER_CANCELLED, "Order Cancelled"),
            (IN_TRANSIT, "In Transit"),
            (EXPIRY, "Expiry")
        ]
    )
    reason = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    inventory_id = serializers.IntegerField(required=False, allow_null=True)
    product_variant_id = serializers.IntegerField(required=False, allow_null=True)
    reference_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    reference_type = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def validate_product_id(self, value):
        """Validate that the product exists"""
        if not Product.objects.filter(id=value).exists():
            raise serializers.ValidationError(f"Product with id {value} does not exist")
        return value

    def validate_vendor_id(self, value):
        """Validate that the vendor exists"""
        if not Vendor.objects.filter(id=value).exists():
            raise serializers.ValidationError(f"Vendor with id {value} does not exist")
        return value

    def validate_inventory_id(self, value):
        """Validate that the inventory exists if provided"""
        if value is not None:
            if not Inventory.objects_all.filter(id=value).exists():
                raise serializers.ValidationError(f"Inventory with id {value} does not exist")
        return value

