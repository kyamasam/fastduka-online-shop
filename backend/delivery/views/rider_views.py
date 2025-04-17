from django.shortcuts import render
from rest_framework import viewsets, status, serializers, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from delivery.constants import RIDER_PENDING
from delivery.models import Rider
from delivery.permissions import CanManageRiders
from delivery.serializers import RiderSerializer
from vendors.constants import VENDOR_ROLE_ADMIN
from vendors.models import VendorMember
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

# Create your views here.
class RiderViewSet(viewsets.ModelViewSet):
    """ rider statueses are 
        'PENDING'
        'ACTIVE'
        'REJECTED'
        'DEACTIVATED'
    """
    serializer_class = RiderSerializer
    filter_backends = [filters.SearchFilter,DjangoFilterBackend]

    permission_classes = [IsAuthenticated, CanManageRiders]
    
    def get_queryset(self):
        queryset = Rider.objects.all()
        
        # Get vendor_id from query params
        vendor_id = self.request.query_params.get('vendor_id', None)
        
        if self.request.user.is_superuser:
            if vendor_id:
                return queryset.filter(vendor_id=vendor_id)
            return queryset
            
        # Get all vendors where user is admin
        user_vendor_ids = VendorMember.objects.filter(
            user=self.request.user,
            role=VENDOR_ROLE_ADMIN
        ).values_list('vendor_id', flat=True)
        
        if vendor_id:
            # Ensure requested vendor is one where user is admin
            if int(vendor_id) in user_vendor_ids:
                return queryset.filter(vendor_id=vendor_id)
            return Rider.objects.none()
            
        # Return riders from all vendors where user is admin
        return queryset.filter(
            Q(vendor_id__in=user_vendor_ids) | Q(vendor__isnull=True)
        )


    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='vendor_id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Filter riders by vendor ID. If not provided, returns riders from all vendors user has access to.',
                required=False
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    def perform_create(self, serializer):
        # Ensure user exists
        user = serializer.validated_data.get('user')
        
        # Check if user is already a rider
        if Rider.objects.filter(user=user).exists():
            raise serializers.ValidationError({
                "user": "This user is already a rider"
            })
            
        serializer.save(approval_status=RIDER_PENDING)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        rider = self.get_object()
        serializer = RiderApprovalSerializer(data=request.data)
        
        if serializer.is_valid():
            new_status = serializer.validated_data['approval_status']
            
            # Validate status transition
            if new_status not in [RIDER_ACTIVE, RIDER_REJECTED, RIDER_DEACTIVATED]:
                return Response(
                    {"detail": "Invalid status transition"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            rider.approval_status = new_status
            rider.save()
            
            return Response(RiderSerializer(rider).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
