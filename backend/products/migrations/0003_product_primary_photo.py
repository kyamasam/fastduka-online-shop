# Generated by Django 5.1.1 on 2024-09-16 08:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_alter_product_allowable_discount_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='primary_photo',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
