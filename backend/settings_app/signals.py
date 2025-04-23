from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import SiteSettings

@receiver(post_migrate)
def create_default_site_settings(sender, **kwargs):
    if not SiteSettings.objects.exists():
        SiteSettings.objects.create(
            title="My Site",
            description="Default site description.",
            primary_color="#000000",
            secondary_color="#ffffff",
            mpesa_paybill_number="123456",
            fastduka_orgid="default-org-id",
            fastduka_config_id="default-config-id",
            fastduka_api_key="default-api-key",
            google_maps_api_key="default-maps-key",
            maintenance_mode=False,
            match_user_to_closest_vendor=False
        )
