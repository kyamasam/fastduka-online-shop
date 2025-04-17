from rest_framework import serializers

from inventory.models import Inventory, InventoryHistory
from vendors.models import Vendor, VendorMember
from vendors.serializers import VendorSerializer
from vendors.constants import VENDOR_ROLE_ADMIN
class InventorySerializer(serializers.ModelSerializer):
    vendor_id = serializers.PrimaryKeyRelatedField(queryset=Vendor.objects.all(), write_only=True)
    vendor =  VendorSerializer(read_only=True)
    class Meta:
        model = Inventory
        fields = [
            "product",
            "product_variant",
            "quantity",
            "vendor_id",
            "vendor"
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
    inventory = InventorySerializer(read_only=True)
    inventory_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Inventory.objects.all())
    class Meta:
        model = InventoryHistory
        fields = [
            "inventory",
            "inventory_id",
            "reference_id",
            "action_type",
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

