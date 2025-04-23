from django.db import models

class SiteSettings(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    primary_color = models.CharField(max_length=7, help_text="Hex code (e.g., #FF5733)")
    secondary_color = models.CharField(max_length=7, help_text="Hex code (e.g., #33C1FF)")
    site_icon = models.ImageField(upload_to='site_icons/', null=True, blank=True)
    site_logo = models.ImageField(upload_to='site_logos/', null=True, blank=True)
    mpesa_paybill_number = models.CharField(max_length=20)

    fastduka_orgid = models.CharField(max_length=255)
    fastduka_config_id = models.CharField(max_length=255)
    fastduka_api_key = models.CharField(max_length=255)

    google_maps_api_key = models.CharField(max_length=255)

    maintenance_mode = models.BooleanField(default=False)
    match_user_to_closest_vendor = models.BooleanField(default=False)

    def __str__(self):
        return self.title
