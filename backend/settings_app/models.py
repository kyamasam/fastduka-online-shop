from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
class UtilColumnsModel(models.Model):
    """Abstract model for created_at & updated_at fields."""

    created_at = models.DateTimeField(default=timezone.now, null=True, blank=True)
    updated_at = models.DateTimeField(blank=True, null=True, default=timezone.now)
    is_active = models.BooleanField(default=True)

    class Meta:
        """Meta definition for TimeStampedModel."""
        abstract = True

class SiteSettings(UtilColumnsModel):
    # Site Information
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    industry = models.CharField(max_length=255, blank=True, null=True)
    contact_email = models.EmailField(max_length=255, null=True, blank=True)
    contact_phone = models.CharField(max_length=20, null=True, blank=True)
    
    # Appearance
    primary_color = models.CharField(max_length=7, help_text="Hex code (e.g., #FF5733)")
    secondary_color = models.CharField(max_length=7, help_text="Hex code (e.g., #33C1FF)")
    site_icon = models.ImageField(upload_to='site_icons/', null=True, blank=True)
    site_logo = models.ImageField(upload_to='site_logos/', null=True, blank=True)
    
    # Social Media
    facebook_url = models.URLField(max_length=255, null=True, blank=True)
    twitter_url = models.URLField(max_length=255, null=True, blank=True)
    instagram_url = models.URLField(max_length=255, null=True, blank=True)
    youtube_url = models.URLField(max_length=255, null=True, blank=True)
    
    # Payment Settings
    currency_code = models.CharField(max_length=3, default="KES")
    currency_symbol = models.CharField(max_length=5, default="Ksh")
    mpesa_paybill_number = models.CharField(max_length=20)
    fastduka_orgid = models.CharField(max_length=255)
    fastduka_config_id = models.CharField(max_length=255)
    fastduka_api_key = models.CharField(max_length=255)
    
    # Order Settings
    default_tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=16.00)
    minimum_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    default_delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    free_delivery_threshold = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Delivery Settings
    default_delivery_radius = models.DecimalField(max_digits=5, decimal_places=1, default=10.0, 
                                                  validators=[MinValueValidator(0.1)])
    estimated_delivery_time_min = models.PositiveIntegerField(default=30, help_text="In minutes")
    estimated_delivery_time_max = models.PositiveIntegerField(default=60, help_text="In minutes")
    match_user_to_closest_vendor = models.BooleanField(default=False)

    
    # Google Services
    google_maps_api_key = models.CharField(max_length=255)
    google_analytics_id = models.CharField(max_length=50, null=True, blank=True)
    
    # Email Settings
    smtp_host = models.CharField(max_length=255, null=True, blank=True)
    smtp_port = models.IntegerField(null=True, blank=True)
    smtp_user = models.CharField(max_length=255, null=True, blank=True)
    smtp_password = models.CharField(max_length=255, null=True, blank=True)
    default_from_email = models.EmailField(max_length=255, null=True, blank=True)
    
    # System Settings
    maintenance_mode = models.BooleanField(default=False)
    items_per_page = models.PositiveIntegerField(default=20)
    enable_reviews = models.BooleanField(default=True)
    
    # Terms and Policies
    terms_and_conditions = models.TextField(null=True, blank=True)
    privacy_policy = models.TextField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        if not self.pk and SiteSettings.objects.exists():
            return SiteSettings.objects.first()
        return super().save(*args, **kwargs)