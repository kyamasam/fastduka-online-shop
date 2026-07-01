from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('settings_app', '0015_sitesettings_top_menu_bg_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesettings',
            name='tiktok_url',
            field=models.URLField(blank=True, max_length=255, null=True),
        ),
    ]
