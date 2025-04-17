from django.db import models

from delivery.constants import RIDER_PENDING, RIDER_STATUS_CHOICES
from users.models import User, UtilColumnsModel
from vendors.models import Vendor

# Create your models here.

class Rider(UtilColumnsModel):
    user =  models.ForeignKey(User,on_delete=models.CASCADE )
    approval_status = models.CharField(max_length=255, default=RIDER_PENDING, choices = RIDER_STATUS_CHOICES)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, null=True, blank=True)



    def __str__(self):
        return self.user.get_full_name()
    