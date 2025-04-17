from django.contrib import admin

from vendors.models import Vendor, VendorMember, VendorVerificationDocument

# Register your models here.

admin.site.register(Vendor)
admin.site.register(VendorVerificationDocument)
admin.site.register(VendorMember)