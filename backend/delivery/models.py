from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

from delivery.constants import RIDER_PENDING, RIDER_STATUS_CHOICES
from users.models import User, UtilColumnsModel
from vendors.models import Vendor


class DeliveryCity(UtilColumnsModel):
    name = models.CharField(max_length=255, unique=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = 'Delivery cities'

    def __str__(self):
        return self.name


class DeliveryLocation(UtilColumnsModel):
    city = models.ForeignKey(
        DeliveryCity,
        on_delete=models.CASCADE,
        related_name='locations',
    )
    name = models.CharField(max_length=255)
    delivery_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
    )
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        constraints = [
            models.UniqueConstraint(
                fields=['city', 'name'],
                name='unique_delivery_location_per_city',
            ),
        ]

    def __str__(self):
        return f'{self.name}, {self.city.name}'

# Create your models here.

class Rider(UtilColumnsModel):
    user =  models.ForeignKey(User,on_delete=models.CASCADE )
    approval_status = models.CharField(max_length=255, default=RIDER_PENDING, choices = RIDER_STATUS_CHOICES)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, null=True, blank=True)



    def __str__(self):
        return self.user.get_full_name()
    
