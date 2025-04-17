from django.shortcuts import render
from rest_framework import viewsets, serializers
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from inventory.models import Inventory
from inventory.serializers import InventorySerializer, InventoryHistorySerializer
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
    filterset_fields = [
        'vendor_id',
        'product_id'
    ]

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
                name='product_id',
                type=int,
                location=OpenApiParameter.QUERY,
                description='Filter by product ID',
                required=False
            ),
        ],
        description='List inventory items with optional filtering by vendor and product'
    )
    def list(self, request, *args, **kwargs):
        """
        List inventory items with optional filtering.
        Supports filtering by vendor_id and product_id query parameters.
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
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

class InventoryHistoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventoryHistorySerializer
    permission_classes = [permissions.AnonReadAdminCreate]