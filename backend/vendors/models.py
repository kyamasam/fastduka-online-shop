from django.db import models

from users.models import User, UtilColumnsModel
from vendors.constants import VENDOR_APPROVAL_STATUS_CHOICES, VENDOR_DOCUMENT_TYPES, VENDOR_ROLE_CHOICES, VENDOR_ROLE_EDITOR, VENDOR_STATUS_APPROVED
from django.core.validators import FileExtensionValidator, MaxValueValidator
from django.core.exceptions import ValidationError

    
class Vendor(UtilColumnsModel):
    name = models.CharField(max_length=255, unique=True)

    verification_status = models.CharField(
        default=VENDOR_STATUS_APPROVED,
        max_length=255, 
        choices=VENDOR_APPROVAL_STATUS_CHOICES,
    )
    location = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    delivery_radius = models.FloatField(help_text = "delivery radius in KM",null=True, blank=True)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    


def validate_file_size(value):
    filesize = value.size
    if filesize > 10 * 1024 * 1024:  # 10MB
        raise ValidationError("Maximum file size is 10MB")

class VendorVerificationDocument(UtilColumnsModel):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='documents')
    document = models.FileField(
        validators=[
            FileExtensionValidator(allowed_extensions=['pdf', 'png', 'jpg', 'jpeg']),
            validate_file_size
        ],
        help_text="Upload PDF, PNG, or JPEG files (max 10MB)"
    )
    document_type = models.CharField(max_length=255, choices =VENDOR_DOCUMENT_TYPES)

class VendorMember(UtilColumnsModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=255,
        default=VENDOR_ROLE_EDITOR, 
        choices=VENDOR_ROLE_CHOICES
    )
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='members')


    def __str__(self):
        return f"{self.user} is {self.role} in {self.vendor}"
    