import os
import logging

import requests
from django.utils import timezone
from rest_framework import viewsets, serializers, filters,status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.db.models import Q
from orders.constants import ORDER_DELIVERED, ORDER_IN_TRANSIT, ORDER_PAID, ORDER_PLACED, ORDER_PROCESSING
from inventory.services import InventoryService
from inventory.constants import CUSTOMER_ORDER

logger = logging.getLogger(__name__)
from orders.models import CartItem, Cart, OrderItem, Order, Transaction, PURCHASE
from orders.serializers import AssignOrderToRiderSerializer, CartItemSerializer, CartSerializer, OrderDeliverySerializer, OrderSerializer, OrderItemSerializer, \
    OrderStkSerializer, ConfirmPaymentSerializer, TransactionSerializer
from users.constants import USER_TYPE_BUSINESS_MANAGER, USER_TYPE_BUSINESS_OWNER, USER_TYPE_CUSTOMER, USER_TYPE_PLATFORM_MANAGER, USER_TYPE_RIDER
from users.permissions import HasToOwnCart
from vendors.models import VendorMember
from vendors.permissions import IsVendorAdmin, IsVendorEditor, IsVendorShopKeeper
from django_filters.rest_framework import DjangoFilterBackend

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A read-only viewset for viewing transactions.
    Users can only see their own transactions.
    """
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filter transactions to return only those belonging to the current user
        """
        user = self.request.user
        
        # For customers, return only their orders
        if user.user_type == USER_TYPE_RIDER:
            return Order.objects.filter(rider__user=user)
        # For customers, return only their orders
        if user.user_type == USER_TYPE_CUSTOMER:
            return Transaction.objects.filter(user=self.request.user)
        
        # For platform managers, return all orders
        if user.user_type == USER_TYPE_PLATFORM_MANAGER:
            return Transaction.objects.all()
        
        # For business managers and owners, return orders from their vendors
        if user.user_type in [USER_TYPE_BUSINESS_MANAGER, USER_TYPE_BUSINESS_OWNER]:
            # Get all vendors the user is a member of
            vendor_memberships = VendorMember.objects.filter(user=user).values_list('vendor', flat=True)
            order_ids = Order.objects.exclude(vendor=None).filter(
                vendor__in=vendor_memberships
            ).select_related('order')
            transactions = Transaction.objects.filter(
                Q(order__id__in=order_ids)
            ).select_related('user')
            return transactions

        
        # Default case - return empty queryset
        return Transaction.objects.none()
class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasToOwnCart]
    serializer_class = CartSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Cart.objects.filter(user=user)
        return qs


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [HasToOwnCart]


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasToOwnCart]
    serializer_class = OrderSerializer
    filter_backends = [filters.SearchFilter,DjangoFilterBackend]
    search_fields = [ "delivery_location","rider_user__first_name", "rider_user__last_name", "payment_transaction__transaction_code", "payment_transaction__transaction_status"]
    filterset_fields = [
        "user_id",
        "status",
        "payment_transaction__transaction_code",
        "payment_transaction__payment_method",
        "rider_id"    ]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='user_id',
                description='Filter orders by user ID',
                required=False,
                type=int
            ),
            OpenApiParameter(
                name='status',
                description='Filter orders by status',
                required=False,
                type=str,
                enum=[ORDER_PLACED, ORDER_PROCESSING, ORDER_IN_TRANSIT, ORDER_DELIVERED, ORDER_PAID]
            ),
            OpenApiParameter(
                name='payment_transaction__transaction_code',
                description='Filter by MPesa transaction code',
                required=False,
                type=str
            ),
            OpenApiParameter(
                name='payment_transaction__payment_method',
                description='Filter by payment method',
                required=False,
                type=str,
                enum=['mpesa', 'wallet']
            ),
            OpenApiParameter(
                name='rider_id',
                description='Filter orders by rider ID',
                required=False,
                type=int
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(self, request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        context = {"request": request}
        serializer =  OrderSerializer(data=request.data, context=context)
        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        
        data = serializer.save()

        return Response(OrderSerializer(data).data)
    def get_queryset(self):
        user = self.request.user
        
                # For customers, return only their orders
        if user.user_type == USER_TYPE_RIDER:
            return Order.objects.filter(rider__user=user)
        # For customers, return only their orders
        if user.user_type == USER_TYPE_CUSTOMER:
            return Order.objects.filter(user=user)
        
        # For platform managers, return all orders
        if user.user_type == USER_TYPE_PLATFORM_MANAGER:
            return Order.objects.all()
        
        # For business managers and owners, return orders from their vendors
        if user.user_type in [USER_TYPE_BUSINESS_MANAGER, USER_TYPE_BUSINESS_OWNER]:
            # Get all vendors the user is a member of
            vendor_memberships = VendorMember.objects.filter(user=user).values_list('vendor', flat=True)
            
            return Order.objects.exclude(vendor=None).filter(
                vendor__in=vendor_memberships
            )
        
        # Default case - return empty queryset
        return Order.objects.none()

    @action(detail=False, methods=["post"], url_path="create-stk", permission_classes=[IsAuthenticated],
            serializer_class=OrderStkSerializer, )
    def create_stk(self, request):
        #todo: improve so that amount does not come from  FE
        serializer = OrderStkSerializer(data=request.data)
        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        order = Order.objects.get(pk=serializer.data['order_id'])
        if serializer.is_valid():
            # create Transaction
            transaction_amount = serializer.data['amount']
            json_data = {"customer_account_number": serializer.data['phone_number'], "amount": transaction_amount,
                         "receiving_account_number": os.environ.get("FASTDUKA_PAYBILL"),
                         "receiving_organization_id": os.environ.get("FASTDUKA_ORGID"), "payment_method_name": "mpesa",
                         "payment_method_subtype": "stk_push", "config_id": os.environ.get("FASTDUKA_CONFIG_ID"),
                         "transaction_note": "meatworld transaction", }
            api_key = "Api-Key " + os.environ.get("FASTDUKA_API_KEY")
            header = {"Authorization": f"{api_key}", "Content-Type": "application/json", }

            response = requests.post("https://api.fastduka.co.ke/api/transaction/", json=json_data, headers=header, )

            # Check the status code to see if the request was successful
            if response.status_code == 200:
                response_data = response.json()
                paymentTransaction = Transaction.objects.create(customer_account_number=serializer.data['phone_number'],
                                                                user=self.request.user, transaction_type=PURCHASE,
                                                                transaction_amount=transaction_amount, )
                paymentTransaction.transaction_identifier = response_data["idempotency_key"]
                order.payment_transaction = paymentTransaction
                order.save()
                paymentTransaction.save()
            else:
                raise serializers.ValidationError(f"{response.text}")

            return Response(OrderSerializer(order).data)

    @action(detail=False, methods=["post"], url_path="confirm-payment", permission_classes=[IsAuthenticated],
            serializer_class=ConfirmPaymentSerializer, )
    def confirm_payment(self, request):
        payment_transaction_serializer = ConfirmPaymentSerializer(data=request.data)
        if not payment_transaction_serializer.is_valid():
            raise serializers.ValidationError(payment_transaction_serializer.errors)
        order = Order.objects.get(pk=payment_transaction_serializer.data['order_id'])
        payment_transaction = Transaction.objects.get(
            pk=payment_transaction_serializer.data['transaction_id'])

        api_key = "Api-Key " + os.environ.get("FASTDUKA_API_KEY")
        header = {"Authorization": f"{api_key}", "Content-Type": "application/json", }
        response = requests.get(
            f"https://api.fastduka.co.ke/api/retrieve_transaction_by_idempotency_key/{payment_transaction.transaction_identifier}/",
            headers=header, )

        if response.status_code != 200:
            raise serializers.ValidationError(f"{response.text}")
        else:
            response_data = response.json()

            transaction_code = response_data.get("transaction_confirmation_number")
            transaction_status = response_data.get("transaction_status")
            payment_transaction.transaction_amount=response_data.get("amount")
            payment_transaction.transaction_code = (transaction_code if transaction_code != "" else None)
            payment_transaction.transaction_status = transaction_status
            payment_transaction.save()

            order_total = calculate_order_value(order)
            if order_total <= payment_transaction.transaction_amount and payment_transaction.transaction_status=='processed':
                order.status=ORDER_PAID
                order.save()


        # confirm if the order is fully paid
        return Response(OrderSerializer(order).data)
    

    @action(detail=False, methods=["post"], url_path="assign-order-to-rider", permission_classes=[ IsVendorEditor |IsVendorShopKeeper | IsVendorAdmin],
            serializer_class=AssignOrderToRiderSerializer,  )
    def assign_order_to_rider(self, request):
        serializer = AssignOrderToRiderSerializer(data=request.data)
        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        order = serializer.validated_data.get('order_id')
        rider = serializer.validated_data.get('rider_id')
        delivery_notes = serializer.validated_data.get('delivery_notes')
        order.rider = rider
        order.status = ORDER_IN_TRANSIT
        order.delivery_notes = delivery_notes
        order.save()
        # todo: notify rider/customer
        return Response(OrderSerializer(order).data)
    
    @action(detail=True, methods=['post'], url_path='mark-delivered', serializer_class=OrderDeliverySerializer, permission_classes=[ IsVendorEditor | IsVendorAdmin | IsVendorShopKeeper])
    def mark_delivered(self, request, pk=None):
        order = self.get_object()

        # Validate signatures
        serializer = OrderDeliverySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Update order with signatures and mark as delivered
        order.customer_signature = serializer.validated_data.get('customer_signature', '')
        order.rider_signature = serializer.validated_data.get('rider_signature', '')
        order.delivery_location = serializer.validated_data.get('delivery_location', order.delivery_location)
        order.delivery_note = serializer.validated_data.get('delivery_note', '')
        order.delivery_completed_at = timezone.now()
        order.status = ORDER_DELIVERED
        order.save()

        # Adjust inventory for each order item
        inventory_service = InventoryService()
        inventory_adjustments = []

        # Build delivery info for the reason field
        customer_name = f"{order.user.first_name} {order.user.last_name}".strip() if order.user else "Unknown Customer"
        delivery_location = order.delivery_location or "Not specified"
        rider_name = f"{order.rider.user.first_name} {order.rider.user.last_name}".strip() if order.rider and order.rider.user else "No rider assigned"

        for order_item in order.orderitem_set.all():
            try:
                # Build a detailed reason with delivery information
                reason = (
                    f"Order #{order.id} delivered. "
                    f"Customer: {customer_name}. "
                    f"Delivery Location: {delivery_location}. "
                    f"Rider: {rider_name}. "
                    f"Product: {order_item.product.name}. "
                    f"Qty: {order_item.quantity}."
                )

                result = inventory_service.adjust_inventory(
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
                    "quantity_deducted": order_item.quantity,
                    "success": result.get('success', False)
                })
            except Exception as e:
                logger.error(f"Failed to adjust inventory for order item {order_item.id}: {str(e)}")
                inventory_adjustments.append({
                    "product_id": order_item.product.id,
                    "product_name": order_item.product.name,
                    "quantity_deducted": order_item.quantity,
                    "success": False,
                    "error": str(e)
                })

        return Response({
            "message": "Order marked as delivered successfully",
            "delivery_time": order.delivery_completed_at,
            "inventory_adjustments": inventory_adjustments
        })
def calculate_order_value(order: Order):
    total = 0
    for order_item in list(order.orderitem_set.all()):
        total += order_item.quantity * order_item.purchase_price
    return total
class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [HasToOwnCart]
