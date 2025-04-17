from rest_framework import permissions

from vendors.constants import VENDOR_ROLE_ADMIN
from vendors.models import VendorMember

class CanManageRiders(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Superusers can manage all riders
        if request.user.is_superuser:
            return True
            
        # Check if user is admin of the vendor
        if obj.vendor:
            return VendorMember.objects.filter(
                vendor=obj.vendor,
                user=request.user,
                role=VENDOR_ROLE_ADMIN
            ).exists()
        return False

    def has_permission(self, request, view):
        # Superusers can manage all riders
        if request.user.is_superuser:
            return True
            
        # For list view, check if user is admin of any vendor
        return VendorMember.objects.filter(
            user=request.user,
            role=VENDOR_ROLE_ADMIN
        ).exists()