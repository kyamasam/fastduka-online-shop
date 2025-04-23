from django.db import models
import django
class UtilColumnsModel(models.Model):
    """Abstract model for created_at & updated_at fields."""

    created_at = models.DateTimeField(default=django.utils.timezone.now, null=True, blank=True)
    updated_at = models.DateTimeField(blank=True, null=True, default=django.utils.timezone.now)
    is_active = models.BooleanField(default=True)

    class Meta:
        """Meta definition for TimeStampedModel."""
        abstract = True


class Config(UtilColumnsModel):
    logo = models.ImageField(null=True, blank=True)
    site_title = models.TextField()
    site_subtitle = models.TextField()
    main_color = models.TextField()
    secondary_color = models.TextField()
    