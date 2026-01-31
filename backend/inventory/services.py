from django.utils import timezone
from typing import Optional, List, Dict, Any
from django.db import transaction
from django.core.exceptions import ValidationError
from inventory.models import Inventory, InventoryHistory
from inventory.constants import (
    CUSTOMER_ORDER,
    STOCK_ADDITION,
    STOCK_DEDUCTION,
    ORDER_CANCELLED,
    IN_TRANSIT,
    EXPIRY
)
from products.models import Product, ProductVariant
from vendors.models import Vendor


class InventoryService:
    """
    Service class for managing inventory adjustments.
    Each action type has its own method with specific logic.
    """

    def __init__(self):
        self.affected_inventories = []
        self.history_records = []

    def adjust_inventory(
        self,
        product_id: int,  # ID of the product to adjust
        vendor_id: int,  # ID of the vendor who owns the inventory
        quantity: float,  # Amount to add/reduce (always positive)
        action_type: str,  # CUSTOMER_ORDER, STOCK_ADDITION, STOCK_DEDUCTION, ORDER_CANCELLED, IN_TRANSIT, or EXPIRY
        reason: Optional[str] = None,  # Optional explanation for the adjustment
        inventory_id: Optional[int] = None,  # Optional: target specific inventory record, otherwise uses FIFO
        product_variant_id: Optional[int] = None,  # Optional: ID of product variant (size, color, etc.)
        reference_id: Optional[str] = None,  # Optional: external reference like order ID or PO number
        reference_type: Optional[str] = None  # Optional: type of reference (order, purchase_order, etc.)
    ) -> Dict[str, Any]:
        """
        Main method to adjust inventory based on action type.
        Routes to specific method based on action_type.
        """
        # Validate inputs
        self._validate_inputs(product_id, vendor_id, quantity, action_type)

        # Route to specific method based on action_type
        if action_type == STOCK_ADDITION:
            return self.stock_addition(
                product_id, vendor_id, quantity, reason,
                inventory_id, product_variant_id, reference_id, reference_type
            )
        elif action_type == STOCK_DEDUCTION:
            return self.stock_deduction(
                product_id, vendor_id, quantity, reason,
                inventory_id, product_variant_id, reference_id, reference_type
            )
        elif action_type == ORDER_CANCELLED:
            return self.order_cancelled(
                product_id, vendor_id, quantity, reason,
                inventory_id, product_variant_id, reference_id, reference_type
            )
        elif action_type == CUSTOMER_ORDER:
            return self.customer_order(
                product_id, vendor_id, quantity, reason,
                inventory_id, product_variant_id, reference_id, reference_type
            )
        elif action_type == IN_TRANSIT:
            return self.in_transit(
                product_id, vendor_id, quantity, reason,
                inventory_id, product_variant_id, reference_id, reference_type
            )
        elif action_type == EXPIRY:
            return self.expiry(
                product_id, vendor_id, quantity, reason,
                inventory_id, product_variant_id, reference_id, reference_type
            )
        else:
            raise ValidationError(f"Invalid action_type: {action_type}")

    @transaction.atomic
    def stock_addition(
        self,
        product_id: int,
        vendor_id: int,
        quantity: float,
        reason: Optional[str] = None,
        inventory_id: Optional[int] = None,
        product_variant_id: Optional[int] = None,
        reference_id: Optional[str] = None,
        reference_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Add stock to inventory.
        If inventory_id provided, add to that record.
        Otherwise, create new inventory record.
        """
        product = Product.objects.get(id=product_id)
        vendor = Vendor.objects.get(id=vendor_id)
        product_variant = ProductVariant.objects.get(id=product_variant_id) if product_variant_id else None

        if inventory_id:
            # Add to specific inventory record
            inventory = Inventory.objects_all.get(id=inventory_id)
            if inventory.product_id != product_id or inventory.vendor_id != vendor_id:
                raise ValidationError("Inventory record does not match product/vendor")

            previous_value = inventory.quantity
            inventory.updated_at= timezone.now()
            inventory.quantity += quantity
            inventory.save()
        else:
            # Create new inventory record
            inventory = Inventory.objects.create(
                product=product,
                vendor=vendor,
                product_variant=product_variant,
                quantity=quantity,
                is_expired=False
            )
            previous_value = 0

        # Create history record
        history = InventoryHistory.objects.create(
            inventory=inventory,
            reference_id=reference_id,
            reference_type=reference_type,
            previous_value=previous_value,
            new_value=inventory.quantity,
            quantity=quantity,
            action_type=STOCK_ADDITION,
            reason=reason
        )

        return {
            'success': True,
            'action_type': STOCK_ADDITION,
            'affected_inventories': [inventory],
            'history_records': [history],
            'total_quantity_adjusted': quantity
        }

    @transaction.atomic
    def stock_deduction(
        self,
        product_id: int,
        vendor_id: int,
        quantity: float,
        reason: Optional[str] = None,
        inventory_id: Optional[int] = None,
        product_variant_id: Optional[int] = None,
        reference_id: Optional[str] = None,
        reference_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Manually reduce stock for corrections or mistakes.
        If inventory_id provided, reduce from that record.
        Otherwise, use FIFO to reduce from oldest records.
        """
        return self._reduce_inventory_fifo(
            product_id, vendor_id, quantity, STOCK_DEDUCTION,
            reason, inventory_id, product_variant_id, reference_id, reference_type
        )

    @transaction.atomic
    def order_cancelled(
        self,
        product_id: int,
        vendor_id: int,
        quantity: float,
        reason: Optional[str] = None,
        inventory_id: Optional[int] = None,
        product_variant_id: Optional[int] = None,
        reference_id: Optional[str] = None,
        reference_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Add stock back to inventory (cancelled order).
        If inventory_id provided, add to that record.
        Otherwise, create new inventory record.
        """
        product = Product.objects.get(id=product_id)
        vendor = Vendor.objects.get(id=vendor_id)
        product_variant = ProductVariant.objects.get(id=product_variant_id) if product_variant_id else None

        if inventory_id:
            # Add to specific inventory record
            inventory = Inventory.objects_all.get(id=inventory_id)
            if inventory.product_id != product_id or inventory.vendor_id != vendor_id:
                raise ValidationError("Inventory record does not match product/vendor")

            previous_value = inventory.quantity
            inventory.quantity += quantity
            inventory.save()
        else:
            # Create new inventory record
            inventory = Inventory.objects.create(
                product=product,
                vendor=vendor,
                product_variant=product_variant,
                quantity=quantity,
                is_expired=False
            )
            previous_value = 0

        # Create history record
        history = InventoryHistory.objects.create(
            inventory=inventory,
            reference_id=reference_id,
            reference_type=reference_type,
            previous_value=previous_value,
            new_value=inventory.quantity,
            quantity=quantity,
            action_type=ORDER_CANCELLED,
            reason=reason
        )

        return {
            'success': True,
            'action_type': ORDER_CANCELLED,
            'affected_inventories': [inventory],
            'history_records': [history],
            'total_quantity_adjusted': quantity
        }

    @transaction.atomic
    def customer_order(
        self,
        product_id: int,
        vendor_id: int,
        quantity: float,
        reason: Optional[str] = None,
        inventory_id: Optional[int] = None,
        product_variant_id: Optional[int] = None,
        reference_id: Optional[str] = None,
        reference_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Reduce stock for customer order.
        If inventory_id provided, reduce from that record.
        Otherwise, use FIFO to reduce from oldest records.
        """
        return self._reduce_inventory_fifo(
            product_id, vendor_id, quantity, CUSTOMER_ORDER,
            reason, inventory_id, product_variant_id, reference_id, reference_type
        )

    @transaction.atomic
    def in_transit(
        self,
        product_id: int,
        vendor_id: int,
        quantity: float,
        reason: Optional[str] = None,
        inventory_id: Optional[int] = None,
        product_variant_id: Optional[int] = None,
        reference_id: Optional[str] = None,
        reference_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Reduce stock for in-transit items.
        If inventory_id provided, reduce from that record.
        Otherwise, use FIFO to reduce from oldest records.
        """
        return self._reduce_inventory_fifo(
            product_id, vendor_id, quantity, IN_TRANSIT,
            reason, inventory_id, product_variant_id, reference_id, reference_type
        )

    @transaction.atomic
    def expiry(
        self,
        product_id: int,
        vendor_id: int,
        quantity: float,
        reason: Optional[str] = None,
        inventory_id: Optional[int] = None,
        product_variant_id: Optional[int] = None,
        reference_id: Optional[str] = None,
        reference_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Mark stock as expired.
        If inventory_id provided, reduce from that record and mark expired.
        Otherwise, use FIFO to reduce, then create new expired inventory record.
        """
        product = Product.objects.get(id=product_id)
        vendor = Vendor.objects.get(id=vendor_id)
        product_variant = ProductVariant.objects.get(id=product_variant_id) if product_variant_id else None

        if inventory_id:
            # Reduce from specific inventory record
            inventory = Inventory.objects.get(id=inventory_id)
            if inventory.product_id != product_id or inventory.vendor_id != vendor_id:
                raise ValidationError("Inventory record does not match product/vendor")

            if inventory.quantity < quantity:
                raise ValidationError(
                    f"Insufficient quantity in inventory. Available: {inventory.quantity}, Requested: {quantity}"
                )

            previous_value = inventory.quantity
            inventory.quantity -= quantity

            # If quantity reaches 0, mark as expired
            if inventory.quantity == 0:
                inventory.is_expired = True
            inventory.updated_at= timezone.now()
            inventory.save()

            # Create history record
            history = InventoryHistory.objects.create(
                inventory=inventory,
                reference_id=reference_id,
                reference_type=reference_type,
                previous_value=previous_value,
                new_value=inventory.quantity,
                quantity=quantity,
                action_type=EXPIRY,
                reason=reason
            )

            return {
                'success': True,
                'action_type': EXPIRY,
                'affected_inventories': [inventory],
                'history_records': [history],
                'total_quantity_adjusted': quantity,
                'expired_inventory': inventory
            }
        else:
            # FIFO: Reduce from oldest records, then create new expired record
            inventories = Inventory.objects.filter(
                product_id=product_id,
                vendor_id=vendor_id,
                product_variant_id=product_variant_id
            ).order_by('created_at')

            # Check total available quantity
            total_available = sum(inv.quantity for inv in inventories)
            if total_available < quantity:
                raise ValidationError(
                    f"Insufficient inventory. Available: {total_available}, Requested: {quantity}"
                )

            # Reduce using FIFO
            remaining_to_reduce = quantity
            affected_inventories = []
            history_records = []

            for inventory in inventories:
                if remaining_to_reduce == 0:
                    break

                if inventory.quantity > 0:
                    previous_value = inventory.quantity
                    reduction_amount = min(inventory.quantity, remaining_to_reduce)

                    inventory.quantity -= reduction_amount
                    inventory.updated_at= timezone.now()
                    inventory.save()

                    # Create history record
                    history = InventoryHistory.objects.create(
                        inventory=inventory,
                        reference_id=reference_id,
                        reference_type=reference_type,
                        previous_value=previous_value,
                        new_value=inventory.quantity,
                        quantity=reduction_amount,
                        action_type=EXPIRY,
                        reason=reason
                    )

                    affected_inventories.append(inventory)
                    history_records.append(history)
                    remaining_to_reduce -= reduction_amount

            # Create new expired inventory record
            expired_inventory = Inventory.objects.create(
                product=product,
                vendor=vendor,
                product_variant=product_variant,
                quantity=quantity,
                is_expired=True
            )

            # Create history for the expired inventory
            expired_history = InventoryHistory.objects.create(
                inventory=expired_inventory,
                reference_id=reference_id,
                reference_type=reference_type,
                previous_value=0,
                new_value=quantity,
                quantity=quantity,
                action_type=EXPIRY,
                reason=reason
            )

            affected_inventories.append(expired_inventory)
            history_records.append(expired_history)

            return {
                'success': True,
                'action_type': EXPIRY,
                'affected_inventories': affected_inventories,
                'history_records': history_records,
                'total_quantity_adjusted': quantity,
                'expired_inventory': expired_inventory
            }

    def _reduce_inventory_fifo(
        self,
        product_id: int,
        vendor_id: int,
        quantity: float,
        action_type: str,
        reason: Optional[str] = None,
        inventory_id: Optional[int] = None,
        product_variant_id: Optional[int] = None,
        reference_id: Optional[str] = None,
        reference_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Helper method to reduce inventory using FIFO logic.
        """
        if inventory_id:
            # Reduce from specific inventory record
            inventory = Inventory.objects.get(id=inventory_id)
            if inventory.product_id != product_id or inventory.vendor_id != vendor_id:
                raise ValidationError("Inventory record does not match product/vendor")

            if inventory.quantity < quantity:
                raise ValidationError(
                    f"Insufficient quantity in inventory. Available: {inventory.quantity}, Requested: {quantity}"
                )

            previous_value = inventory.quantity
            inventory.quantity -= quantity
            inventory.save()

            # Create history record
            history = InventoryHistory.objects.create(
                inventory=inventory,
                reference_id=reference_id,
                reference_type=reference_type,
                previous_value=previous_value,
                new_value=inventory.quantity,
                quantity=quantity,
                action_type=action_type,
                reason=reason
            )

            return {
                'success': True,
                'action_type': action_type,
                'affected_inventories': [inventory],
                'history_records': [history],
                'total_quantity_adjusted': quantity
            }
        else:
            # FIFO: Reduce from oldest non-expired records
            inventories = Inventory.objects.filter(
                product_id=product_id,
                vendor_id=vendor_id,
                product_variant_id=product_variant_id
            ).order_by('created_at')

            # Check total available quantity
            total_available = sum(inv.quantity for inv in inventories)
            if total_available < quantity:
                raise ValidationError(
                    f"Insufficient inventory. Available: {total_available}, Requested: {quantity}"
                )

            # Reduce using FIFO
            remaining_to_reduce = quantity
            affected_inventories = []
            history_records = []

            for inventory in inventories:
                if remaining_to_reduce == 0:
                    break

                if inventory.quantity > 0:
                    previous_value = inventory.quantity
                    reduction_amount = min(inventory.quantity, remaining_to_reduce)

                    inventory.quantity -= reduction_amount
                    inventory.updated_at= timezone.now()
                    inventory.save()

                    # Create history record
                    history = InventoryHistory.objects.create(
                        inventory=inventory,
                        reference_id=reference_id,
                        reference_type=reference_type,
                        previous_value=previous_value,
                        new_value=inventory.quantity,
                        quantity=reduction_amount,
                        action_type=action_type,
                        reason=reason
                    )

                    affected_inventories.append(inventory)
                    history_records.append(history)
                    remaining_to_reduce -= reduction_amount

            return {
                'success': True,
                'action_type': action_type,
                'affected_inventories': affected_inventories,
                'history_records': history_records,
                'total_quantity_adjusted': quantity
            }

    def _validate_inputs(
        self,
        product_id: int,
        vendor_id: int,
        quantity: float,
        action_type: str
    ):
        """Validate input parameters"""
        if quantity <= 0:
            raise ValidationError("Quantity must be positive")

        valid_action_types = [CUSTOMER_ORDER, STOCK_ADDITION, STOCK_DEDUCTION, ORDER_CANCELLED, IN_TRANSIT, EXPIRY]
        if action_type not in valid_action_types:
            raise ValidationError(f"Invalid action_type. Must be one of: {valid_action_types}")

        if not Product.objects.filter(id=product_id).exists():
            raise ValidationError(f"Product with id {product_id} does not exist")

        if not Vendor.objects.filter(id=vendor_id).exists():
            raise ValidationError(f"Vendor with id {vendor_id} does not exist")
