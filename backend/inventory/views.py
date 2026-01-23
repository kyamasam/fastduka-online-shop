from rest_framework import viewsets, serializers, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum
from django.core.exceptions import ValidationError as DjangoValidationError
from inventory.models import Inventory
from inventory.serializers import InventorySerializer, InventoryHistorySerializer, InventoryAdjustmentSerializer
from inventory.services import InventoryService
from users import permissions
from rest_framework.response import Response
from vendors.permissions import IsVendorAdmin

class InventoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing product inventory.
    """
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.AnonReadAdminCreate, IsVendorAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['vendor_id']
    search_fields = ['product__name', 'product__description']

    def get_queryset(self):
        """
        Optionally filter inventory by product attributes.
        """
        queryset = super().get_queryset()

        # Filter by category_id (supports multiple values separated by commas)
        category_ids = self.request.query_params.get('category_id', None)
        if category_ids:
            category_list = [int(id) for id in category_ids.split(',')]
            queryset = queryset.filter(product__category_id__in=category_list)

        # Filter by featured
        featured = self.request.query_params.get('featured', None)
        if featured is not None:
            featured_bool = featured.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(product__featured=featured_bool)

        # Filter by in_stock
        in_stock = self.request.query_params.get('in_stock', None)
        if in_stock is not None:
            in_stock_bool = in_stock.lower() in ['true', '1', 'yes']
            if in_stock_bool:
                queryset = queryset.filter(quantity__gt=0)
            else:
                queryset = queryset.filter(quantity=0)

        # Filter by on_sale
        on_sale = self.request.query_params.get('on_sale', None)
        if on_sale is not None:
            on_sale_bool = on_sale.lower() in ['true', '1', 'yes']
            if on_sale_bool:
                queryset = queryset.filter(product__sale_price__gt=0)
            else:
                queryset = queryset.filter(product__sale_price=0)

        return queryset

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='vendor_id',
                type=int,
                location=OpenApiParameter.QUERY,
                description='Filter by vendor ID',
                required=False
            ),
            OpenApiParameter(
                name='category_id',
                type={'type': 'array', 'items': {'type': 'integer'}},
                location=OpenApiParameter.QUERY,
                description='Filter by category ID(s). Multiple values may be separated by commas.',
                required=False
            ),
            OpenApiParameter(
                name='featured',
                type=bool,
                location=OpenApiParameter.QUERY,
                description='Filter by featured products',
                required=False
            ),
            OpenApiParameter(
                name='in_stock',
                type=bool,
                location=OpenApiParameter.QUERY,
                description='Filter by stock availability',
                required=False
            ),
            OpenApiParameter(
                name='on_sale',
                type=bool,
                location=OpenApiParameter.QUERY,
                description='Filter by products on sale',
                required=False
            ),
            OpenApiParameter(
                name='search',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Search by product name or description',
                required=False
            ),
            OpenApiParameter(
                name='page',
                type=int,
                location=OpenApiParameter.QUERY,
                description='A page number within the paginated result set',
                required=False
            ),
        ],
        description='List inventory items with optional filtering by vendor, product attributes, and search. Groups by product-variant-vendor combination.'
    )
    def list(self, request, *args, **kwargs):
        """
        List inventory items with optional filtering.
        Groups inventory by product, product_variant, and vendor to show aggregated quantities.
        """
        queryset = self.filter_queryset(self.get_queryset())

        # Group by product, product_variant, and vendor
        grouped_inventory = queryset.values(
            'product',
            'product_variant',
            'vendor'
        ).annotate(
            total_quantity=Sum('quantity')
        ).order_by('product', 'vendor')

        # For each group, get the first inventory record and update its quantity
        result = []
        for group in grouped_inventory:
            inventory = Inventory.objects.filter(
                product_id=group['product'],
                product_variant_id=group['product_variant'],
                vendor_id=group['vendor']
            ).first()

            if inventory:
                # Temporarily override the quantity with aggregated value
                inventory.quantity = group['total_quantity']
                result.append(inventory)

        # Apply pagination
        page = self.paginate_queryset(result)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create a new inventory record.
        """
        context = {'request': request}
        serializer = InventorySerializer(data=request.data, context=context)

        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        serializer.save()
        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='vendor_id',
                type=int,
                location=OpenApiParameter.QUERY,
                description='Filter by vendor ID',
                required=False
            ),
            OpenApiParameter(
                name='category_id',
                type={'type': 'array', 'items': {'type': 'integer'}},
                location=OpenApiParameter.QUERY,
                description='Filter by category ID(s). Multiple values may be separated by commas.',
                required=False
            ),
            OpenApiParameter(
                name='featured',
                type=bool,
                location=OpenApiParameter.QUERY,
                description='Filter by featured products',
                required=False
            ),
            OpenApiParameter(
                name='in_stock',
                type=bool,
                location=OpenApiParameter.QUERY,
                description='Filter by stock availability',
                required=False
            ),
            OpenApiParameter(
                name='on_sale',
                type=bool,
                location=OpenApiParameter.QUERY,
                description='Filter by products on sale',
                required=False
            ),
            OpenApiParameter(
                name='search',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Search by product name or description',
                required=False
            ),
        ],
        responses={200: InventorySerializer(many=True)},
        description='List all inventory items without pagination. Supports same filters as paginated list. Groups by product-variant-vendor combination.'
    )
    @action(detail=False, methods=['get'], url_path='unpaged')
    def unpaged_list(self, request):
        """
        List all inventory items without pagination.
        Groups inventory by product, product_variant, and vendor to show aggregated quantities.
        Supports all the same filters as the paginated list endpoint.
        """
        queryset = self.filter_queryset(self.get_queryset())

        # Group by product, product_variant, and vendor
        grouped_inventory = queryset.values(
            'product',
            'product_variant',
            'vendor'
        ).annotate(
            total_quantity=Sum('quantity')
        ).order_by('product', 'vendor')

        # For each group, get the first inventory record and update its quantity
        result = []
        for group in grouped_inventory:
            inventory = Inventory.objects.filter(
                product_id=group['product'],
                product_variant_id=group['product_variant'],
                vendor_id=group['vendor']
            ).first()

            if inventory:
                # Temporarily override the quantity with aggregated value
                inventory.quantity = group['total_quantity']
                result.append(inventory)

        # Serialize and return all results without pagination
        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)

    @extend_schema(
        request=InventoryAdjustmentSerializer,
        responses={200: InventorySerializer(many=True)},
        description='Adjust inventory by adding or reducing stock based on action type. '
                    'Supports FIFO logic for reductions when inventory_id is not provided.'
                    '- STOCK_ADDITION: Add new stock'
                    '- STOCK_DEDUCTION: Manually reduce stock for corrections (FIFO if no inventory_id)'
                    '- ORDER_CANCELLED: Return stock from cancelled order'
                    '- CUSTOMER_ORDER: Reduce stock for customer order (FIFO if no inventory_id)'
                    '- IN_TRANSIT: Reduce stock for items in transit (FIFO if no inventory_id)'
                    '- EXPIRY: Mark stock as expired (FIFO if no inventory_id, creates new expired record)'
                    
    )
    @action(detail=False, methods=['post'], permission_classes=[permissions.AnonReadAdminCreate, IsVendorAdmin])
    def adjust(self, request):
        """
        Adjust inventory quantities based on action type.

        Action types:
        - STOCK_ADDITION: Add new stock
        - STOCK_DEDUCTION: Manually reduce stock for corrections (FIFO if no inventory_id)
        - ORDER_CANCELLED: Return stock from cancelled order
        - CUSTOMER_ORDER: Reduce stock for customer order (FIFO if no inventory_id)
        - IN_TRANSIT: Reduce stock for items in transit (FIFO if no inventory_id)
        - EXPIRY: Mark stock as expired (FIFO if no inventory_id, creates new expired record)
        """
        serializer = InventoryAdjustmentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Initialize service and adjust inventory
            service = InventoryService()
            result = service.adjust_inventory(
                product_id=serializer.validated_data['product_id'],
                vendor_id=serializer.validated_data['vendor_id'],
                quantity=serializer.validated_data['quantity'],
                action_type=serializer.validated_data['action_type'],
                reason=serializer.validated_data.get('reason'),
                inventory_id=serializer.validated_data.get('inventory_id'),
                product_variant_id=serializer.validated_data.get('product_variant_id'),
                reference_id=serializer.validated_data.get('reference_id'),
                reference_type=serializer.validated_data.get('reference_type')
            )

            # Serialize affected inventories
            affected_inventories = result['affected_inventories']
            inventory_serializer = InventorySerializer(affected_inventories, many=True)

            return Response({
                'success': True,
                'message': f'Inventory adjusted successfully using {result["action_type"]}',
                'action_type': result['action_type'],
                'total_quantity_adjusted': result['total_quantity_adjusted'],
                'affected_inventories': inventory_serializer.data,
                'history_records_created': len(result['history_records'])
            }, status=status.HTTP_200_OK)

        except DjangoValidationError as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InventoryHistoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventoryHistorySerializer
    permission_classes = [permissions.AnonReadAdminCreate]