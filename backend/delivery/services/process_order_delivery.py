from typing import Any, Dict, List, Optional, TypedDict
from datetime import datetime
from django.utils import timezone
from django.db import transaction
import logging

from inventory.constants import CUSTOMER_ORDER
from inventory.services import InventoryService
from orders.constants import ORDER_DELIVERED
from orders.models import Order

logger = logging.getLogger(__name__)

# --- Types ---

class InventoryAdjustmentResult(TypedDict):
    product_id: int
    product_name: str
    quantity_deducted: float
    success: bool
    # We use Optional[str] because error only exists if success is False
    error: Optional[str]

class DeliveryResult(TypedDict):
    delivery_time: datetime
    inventory_adjustments: List[InventoryAdjustmentResult]

class DeliveryData(TypedDict, total=False):
    """
    total=False allows us to pass a dict with only some of these keys.
    """
    customer_signature: str
    rider_signature: str
    delivery_location: str
    delivery_note: str
    # Note: These are added during processing, but defined here for completeness
    delivery_completed_at: datetime 
    status: str

# --- Services ---

def process_order_delivery(
    order: Order, 
    delivery_data: Dict[str, Any] # Accepts raw dict from serializer or manual dict
) -> DeliveryResult:
    """
    Handles the business logic for marking an order as delivered.
    """
    if order.status == ORDER_DELIVERED:
        logger.warning(f"Order {order.id} is already delivered. Skipping delivery processing.")
        return {
            "delivery_time": order.delivery_completed_at,
            "inventory_adjustments": [] 
        }

    with transaction.atomic():
        # Update order details
        order.customer_signature = delivery_data.get('customer_signature', '')
        order.rider_signature = delivery_data.get('rider_signature', '')
        order.delivery_location = delivery_data.get('delivery_location', order.delivery_location)
        order.delivery_note = delivery_data.get('delivery_note', '')
        order.delivery_completed_at = timezone.now()
        order.status = ORDER_DELIVERED
        order.save()

        inventory_service = InventoryService()
        inventory_adjustments: List[InventoryAdjustmentResult] = []

        # Logic for string formatting
        customer_name: str = f"{order.user.first_name} {order.user.last_name}".strip() if order.user else "Unknown Customer"
        delivery_loc_str: str = str(order.delivery_location or "Not specified")
        rider_name: str = (
            f"{order.rider.user.first_name} {order.rider.user.last_name}".strip() 
            if order.rider and order.rider.user else "No rider assigned"
        )

        for order_item in order.orderitem_set.all():
            try:
                reason: str = (
                    f"Order #{order.id} delivered. Customer: {customer_name}. "
                    f"Location: {delivery_loc_str}. Rider: {rider_name}. "
                    f"Product: {order_item.product.name}. Qty: {order_item.quantity}."
                )

                result: Dict[str, Any] = inventory_service.adjust_inventory(
                    product_id=order_item.product.id,
                    vendor_id=order.vendor.id,
                    quantity=order_item.quantity,
                    action_type=CUSTOMER_ORDER, 
                    reason=reason,
                    product_variant_id=order_item.product_variant.id if order_item.product_variant else None,
                    reference_id=str(order.id),
                    reference_type="order"
                )
                
                inventory_adjustments.append({
                    "product_id": order_item.product.id,
                    "product_name": order_item.product.name,
                    "quantity_deducted": float(order_item.quantity),
                    "success": bool(result.get('success', False)),
                    "error": None
                })
            except Exception as e:
                logger.error(f"Inventory adjustment failed for {order_item.id}: {str(e)}")
                inventory_adjustments.append({
                    "product_id": order_item.product.id,
                    "product_name": order_item.product.name,
                    "quantity_deducted": float(order_item.quantity),
                    "success": False,
                    "error": str(e)
                })

        return {
            "delivery_time": order.delivery_completed_at,
            "inventory_adjustments": inventory_adjustments
        }

def process_automatic_delivery(order: Order) -> DeliveryResult:
    """
    Automatically marks an order as delivered using the base service.
    """
    # Use Dict[str, Any] here to satisfy the receiver's type expectation
    automated_data: Dict[str, Any] = {
        'customer_signature': 'SYSTEM_AUTO_DELIVERY',
        'rider_signature': 'SYSTEM_AUTO_DELIVERY',
        'delivery_location': order.delivery_location or 'System Automated',
        'delivery_note': 'Automatically processed by system.'
    }
    
    return process_order_delivery(order, automated_data)