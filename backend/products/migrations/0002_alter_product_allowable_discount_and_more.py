# Generated by Django 5.1.1 on 2024-09-11 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='allowable_discount',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='sale_price',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
