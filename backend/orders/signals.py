from django.db.models.signals import post_save
from django.dispatch import receiver
import logging

from orders.models import Order
from orders.constants import ORDER_PAID, POS_WEB, ORDER_DELIVERED
from delivery.services.process_order_delivery import process_automatic_delivery

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Order)
def on_order_paid(sender, instance, created, **kwargs):
    """
    Signal handler to automatically process delivery for POS_WEB orders
    when they are marked as PAID.
    """
    # We are only interested in updates, not new orders
    if created:
        return

    # Check if the order status was just changed to PAID and it's a POS_WEB order
    if instance.status == ORDER_PAID and instance.order_client == POS_WEB:
        # Explicitly check if already delivered to avoid unnecessary processing
        if instance.status == ORDER_DELIVERED:
            logger.warning(f"Order {instance.id} is already delivered. Skipping signal processing.")
            return

        logger.info(f"Order {instance.id} for POS_WEB marked as PAID. Triggering automatic delivery.")
        process_automatic_delivery(instance)
