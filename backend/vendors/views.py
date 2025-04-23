from django.shortcuts import render

from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from users.constants import USER_TYPE_BUSINESS_OWNER
from vendors.constants import VENDOR_ROLE_ADMIN, VENDOR_STATUS_APPROVED
from vendors.models import Vendor, VendorMember
from vendors.permissions import IsVendorAdmin
from vendors.serializers import VendorApprovalSerializer, VendorDocumentUploadSerializer, VendorMemberSerializer, VendorSerializer

class VendorViewSet(viewsets.ModelViewSet):
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Vendor.objects.all()
        return Vendor.objects.filter(members__user=self.request.user)

    def perform_create(self, serializer):
        # only users of type USER_TYPE_BUSINESS_OWNER can create Vendors
        if not self.request.user.user_type ==USER_TYPE_BUSINESS_OWNER: 
            raise serializers.ValidationError(f"Only users of type {USER_TYPE_BUSINESS_OWNER} can create Vendors")
        vendor = serializer.save(is_active=True)
        # Create vendor member entry for creator as admin
        VendorMember.objects.create(
            vendor=vendor,
            user=self.request.user,
            role=VENDOR_ROLE_ADMIN
        )

    # def detail(self, request, pk=None):
    #     pass

    @action(detail=True, methods=['post'], serializer_class=VendorApprovalSerializer, permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        vendor = self.get_object()
        serializer = VendorApprovalSerializer(data=request.data)
        
        if serializer.is_valid():
            vendor.verification_status = serializer.validated_data['verification_status']
            vendor.is_active = True if serializer.validated_data['verification_status'] == VENDOR_STATUS_APPROVED else False
            vendor.save()
            return Response(VendorSerializer(vendor).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], serializer_class=VendorDocumentUploadSerializer, permission_classes=[IsAuthenticated, IsVendorAdmin])
    def upload_document(self, request, pk=None):
        vendor = self.get_object()
        serializer = VendorDocumentUploadSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(vendor=vendor)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post', 'delete'], serializer_class=VendorMemberSerializer, permission_classes=[IsAuthenticated, IsVendorAdmin])
    def manage_member(self, request, pk=None):
        vendor = self.get_object()
        
        if request.method == 'POST':
            serializer = VendorMemberSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(vendor=vendor)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            user_id = request.data.get('user_id')
            try:
                member = vendor.members.get(user_id=user_id)
                # Prevent removing the last admin
                if member.role == VENDOR_ROLE_ADMIN and not vendor.members.filter(role=VENDOR_ROLE_ADMIN).exclude(id=member.id).exists():
                    return Response(
                        {"detail": "Cannot remove the last admin"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                member.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except VendorMember.DoesNotExist:
                return Response(
                    {"detail": "Member not found"},
                    status=status.HTTP_404_NOT_FOUND
                )