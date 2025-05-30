# Generated by Django 5.1.1 on 2025-04-23 17:57

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Config',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('updated_at', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='')),
                ('site_title', models.TextField()),
                ('site_subtitle', models.TextField()),
                ('main_color', models.TextField()),
                ('secondary_color', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
