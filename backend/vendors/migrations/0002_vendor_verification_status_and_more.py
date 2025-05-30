# Generated by Django 5.1.1 on 2024-11-27 13:16

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vendors', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='vendor',
            name='verification_status',
            field=models.CharField(choices=[('APPROVED', 'Approved'), ('PENDING', 'Pending'), ('REJECTED', 'Rejected')], default='PENDING', max_length=255),
        ),
        migrations.AddField(
            model_name='vendorverificationdocument',
            name='created_at',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True),
        ),
        migrations.AddField(
            model_name='vendorverificationdocument',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='vendorverificationdocument',
            name='updated_at',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True),
        ),
        migrations.AlterField(
            model_name='vendorverificationdocument',
            name='vendor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='vendors.vendor'),
        ),
        migrations.CreateModel(
            name='VendorMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('updated_at', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('role', models.CharField(choices=[('ADMIN', 'Admin'), ('EDITOR', 'Editor')], default='EDITOR', max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('vendor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='members', to='vendors.vendor')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
