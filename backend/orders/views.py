import os
import logging
import math
import requests
from django.utils import timezone
from rest_framework import viewsets, serializers, filters,status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.db.models import Q
from delivery.services.process_order_delivery import process_automatic_delivery
from orders import constants
from orders.constants import ORDER_DELIVERED, ORDER_IN_TRANSIT, ORDER_PAID, ORDER_PLACED, ORDER_PROCESSING,POS_WEB
from inventory.services import InventoryService
from inventory.constants import CUSTOMER_ORDER

logger = logging.getLogger(__name__)
from orders.models import CartItem, Cart, OrderItem, Order, Transaction, PURCHASE
from orders.serializers import (
    AssignOrderToRiderSerializer, CartItemSerializer, CartSerializer, OrderDeliverySerializer,
    OrderSerializer, OrderItemSerializer, OrderStkSerializer, ConfirmPaymentSerializer,
    TransactionSerializer, POSTransactionSerializer, CalculateTaxRequestSerializer,
    CalculateTaxResponseSerializer
)
from orders.tax_utils import calculate_order_tax
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


class POSTransactionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for creating POS transactions.
    Allows authenticated users to create transactions for POS cash payments.
    """
    serializer_class = POSTransactionSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['post', 'get', 'head', 'options']  # Only allow creation and retrieval

    def get_queryset(self):
        """
        Return transactions created by the current user for POS orders.
        """
        user = self.request.user

        # For platform managers, return all POS transactions
        if user.user_type == USER_TYPE_PLATFORM_MANAGER:
            return Transaction.objects.filter(
                order__order_client='pos_web'
            ).select_related('user')

        # For business managers and owners, return POS transactions from their vendors
        if user.user_type in [USER_TYPE_BUSINESS_MANAGER, USER_TYPE_BUSINESS_OWNER]:
            vendor_memberships = VendorMember.objects.filter(user=user).values_list('vendor', flat=True)
            order_ids = Order.objects.filter(
                vendor__in=vendor_memberships,
                order_client='pos_web'
            ).values_list('id', flat=True)
            return Transaction.objects.filter(
                order__id__in=order_ids
            ).select_related('user')

        # For other users, return only their own POS transactions
        return Transaction.objects.filter(
            user=user,
            order__order_client='pos_web'
        ).select_related('user')

    def create(self, request, *args, **kwargs):
        """
        Create a new POS transaction.
        Validates that payment_method is 'cash' for POS transactions.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Ensure this is a cash transaction for POS
        payment_method = serializer.validated_data.get('payment_method')
        if payment_method != 'cash':
            raise serializers.ValidationError(
                "POS transaction endpoint only supports cash payments. Use order/create-stk for M-Pesa."
            )

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasToOwnCart]
    serializer_class = CartSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Cart.objects.filter(user=user)
        return qs

    def get_serializer_context(self):
        """
        Add context to serializer to conditionally include tax calculations.
        """
        context = super().get_serializer_context()
        # Check if we should include tax breakdown
        include_tax = self.request.query_params.get('include_tax', 'false').lower() == 'true'
        context['include_tax'] = include_tax
        return context

    @action(detail=False, methods=['get'], url_path='with-tax', permission_classes=[IsAuthenticated])
    def get_cart_with_tax(self, request):
        """
        Retrieve the user's cart with complete tax breakdown.

        This endpoint should be called:
        - After adding an item to cart
        - After updating item quantity
        - After removing an item
        - When loading the cart summary page

        Returns cart with tax_total, total_before_tax, total_after_tax breakdown.
        """
        user = request.user

        # Get or create cart for user
        cart, created = Cart.objects.get_or_create(user=user)

        # Serialize with tax calculations
        serializer = CartSerializer(cart, context={'request': request, 'include_tax': True})

        return Response(serializer.data)


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [HasToOwnCart]

    def create(self, request, *args, **kwargs):
        """
        Create a new cart item and return the cart with tax breakdown.
        """
        response = super().create(request, *args, **kwargs)

        # Get the cart from the created item
        cart_item = CartItem.objects.get(pk=response.data['id'])
        cart = cart_item.cart

        # Return cart with tax breakdown
        cart_serializer = CartSerializer(cart, context={'request': request, 'include_tax': True})

        return Response({
            'cart_item': response.data,
            'cart': cart_serializer.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update a cart item and return the cart with tax breakdown.
        """
        response = super().update(request, *args, **kwargs)

        # Get the cart from the updated item
        cart_item = CartItem.objects.get(pk=response.data['id'])
        cart = cart_item.cart

        # Return cart with tax breakdown
        cart_serializer = CartSerializer(cart, context={'request': request, 'include_tax': True})

        return Response({
            'cart_item': response.data,
            'cart': cart_serializer.data
        })

    def destroy(self, request, *args, **kwargs):
        """
        Delete a cart item and return the cart with tax breakdown.
        """
        # Get the cart before deleting the item
        cart_item = self.get_object()
        cart = cart_item.cart

        # Delete the item
        self.perform_destroy(cart_item)

        # Return updated cart with tax breakdown
        cart_serializer = CartSerializer(cart, context={'request': request, 'include_tax': True})

        return Response({
            'message': 'Cart item deleted successfully',
            'cart': cart_serializer.data
        }, status=status.HTTP_200_OK)


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
    
    def get_serializer_class(self):
        if self.action in ['list','retrieve']:
            return OrderSerializer
        if self.action =="create_stk":
            return OrderStkSerializer
        if self.action == "confirm_payment":
            return ConfirmPaymentSerializer
        if self.action =="assign_order_to_rider":
            return AssignOrderToRiderSerializer
        if self.action == "mark_delivered":
            return OrderDeliverySerializer
        if self.action == "calculate_tax":
            return CalculateTaxRequestSerializer
        return super().get_serializer_class()

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
        
        serializer = OrderStkSerializer(data=request.data)
        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)
        order = Order.objects.get(pk=serializer.data['order_id'])
        if serializer.is_valid():
            # create Transaction
            transaction_amount = float(math.ceil(order.total_after_tax or serializer.data['amount']))
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
        order = Order.objects.select_for_update().get(pk=payment_transaction_serializer.data['order_id'])
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
            # confirm if the order is fully paid
            if order_total <= payment_transaction.transaction_amount and payment_transaction.transaction_status=='processed':
                order.status=ORDER_PAID
                order.save()
            
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

        if order.status == ORDER_DELIVERED:
            return Response({"message": "Order is already delivered."}, status=status.HTTP_400_BAD_REQUEST)

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

    @extend_schema(request=CalculateTaxRequestSerializer, responses=CalculateTaxResponseSerializer)

    @action(detail=False, methods=['post'], url_path='calculate-tax',
            serializer_class=CalculateTaxRequestSerializer,
            
            permission_classes=[IsAuthenticated])
    def calculate_tax(self, request):
        """
        Calculate tax for order items before creating an order.

        Request body:
        {
            "items": [
                {
                    "product_id": 1,
                    "quantity": 2,
                    "purchase_price": "150.00"
                }
            ]
        }

        Returns tax calculations for all items and order totals.
        """
        serializer = CalculateTaxRequestSerializer(data=request.data)
        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        # Prepare items for tax calculation
        items_for_calculation = []
        for item in serializer.validated_data['items']:
            items_for_calculation.append({
                'product': item['product_id'],
                'quantity': item['quantity'],
                'purchase_price': item['purchase_price']
            })

        # Calculate taxes
        tax_result = calculate_order_tax(items_for_calculation)

        # Return formatted response
        response_serializer = CalculateTaxResponseSerializer(tax_result)
        return Response(response_serializer.data)
def calculate_order_value(order: Order):
    total = order.total_after_tax
    if total is None:
        for order_item in list(order.orderitem_set.all()):
            total += order_item.quantity * order_item.purchase_price
    return total
class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [HasToOwnCart]
