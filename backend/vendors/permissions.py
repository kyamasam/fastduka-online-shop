from rest_framework import permissions

from vendors.constants import VENDOR_ROLE_ADMIN, VENDOR_ROLE_EDITOR
from vendors.models import Vendor, VendorMember

class IsVendorAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Vendor):
            vendor = obj
        else:
            vendor = obj.vendor

        if request.user.is_superuser:
            return True
            
        return VendorMember.objects.filter(
            vendor=vendor,
            user=request.user,
            role=VENDOR_ROLE_ADMIN
        ).exists()
    
class IsVendorEditor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Vendor):
            vendor = obj
        else:
            vendor = obj.vendor
            
        return VendorMember.objects.filter(
            vendor=vendor,
            user=request.user,
            role=VENDOR_ROLE_EDITOR
        ).exists()