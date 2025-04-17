import os
from datetime import datetime

import django
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser, UserManager
from django.core.validators import RegexValidator
from django.db import models
from django.utils.crypto import get_random_string
from .constants import USER_TYPE_CUSTOMER, user_types

# Create your models here.
class UtilColumnsModel(models.Model):
    """Abstract model for created_at & updated_at fields."""

    created_at = models.DateTimeField(default=django.utils.timezone.now, null=True, blank=True)
    updated_at = models.DateTimeField(blank=True, null=True, default=django.utils.timezone.now)
    is_active = models.BooleanField(default=True)

    class Meta:
        """Meta definition for TimeStampedModel."""
        abstract = True



# Create validator instances that handle None values by setting allow_blank=True
phone_validator = RegexValidator(
    regex=r"^\d{9,10}$",
    message="Enter a valid phone number (9-10 digits)",
)

phone_code_validator = RegexValidator(
    regex=r"^\+\d{1,3}$",
    message="Enter a valid country code (e.g. +254)",
)

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """ Create a new user  """
        if not email:
            raise ValueError('User must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, phone_code, phone_number,  password, **extra_fields):
        """ Create a new superuser  """
        user = self.create_user(email, password,phone_code=phone_code, phone_number=phone_number, **extra_fields)
        user.is_superuser = True
        user.is_staff = True

        user.save(using=self._db)

        return user

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, blank=True, null=True, unique=False )
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    phone_code = models.CharField(
        max_length=4, 
        validators=[phone_code_validator],
        blank=True,
        null=True,
    )
    phone_number = models.CharField(
        max_length=10,
        validators=[phone_validator],
        blank=True,
        null=True,
        unique=True
    )
    staff_number = models.CharField(max_length=30, unique=True, null=True)
    password_reset_code = models.CharField(max_length=300, blank=True, )
    avatar = models.ImageField(blank=True)
    password_reset_code_expires_at = models.DateTimeField(blank=True, null=True)
    password_reset_code_used = models.BooleanField(default=False)
    last_withdrawal_transaction_complete = models.BooleanField(default=True)
    last_withdrawal_time = models.DateTimeField(blank=True, null=True)
    otp_code = models.CharField(max_length=255, blank=True)
    otp_code_used = models.BooleanField(default=False)
    otp_code_expires_at = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [ 'phone_code', 'phone_number']

    user_type = models.CharField(max_length=255, default =USER_TYPE_CUSTOMER, choices= user_types)
    objects = CustomUserManager()

    def clean(self):
        super().clean()

    def save(self, *args, **kwargs):
        if self.username is None:
            self.username =  self.email
        return super().save(*args, **kwargs)


def custom_profile_photo_upload_to(instance, file):
    file_extension = os.path.splitext(str(file))[1]
    random_string = get_random_string(length=6)
    file_name = f"profile_{random_string}"
    today = datetime.today()
    date_str = today.strftime("%Y/%m/%d")  # Format: year/month/day
    return (f"profile_photo/cover/{date_str}/{instance.user.id}{file_name}{file_extension}")


def custom_profile_cover_photo_upload_to(instance, file):
    file_extension = os.path.splitext(str(file))[1]
    random_string = get_random_string(length=6)
    file_name = f"profile_cover_{random_string}"
    today = datetime.today()
    date_str = today.strftime("%Y/%m/%d")  # Format: year/month/day
    return (f"profile_cover_photo/{date_str}/{instance.user.id}{file_name}{file_extension}")


class Profile(UtilColumnsModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    cover_photo = models.ImageField(null=True, blank=True, upload_to=custom_profile_cover_photo_upload_to)
    tagline = models.CharField(max_length=400, null=True, blank=True)
    profile_photo = models.FileField(null=True, blank=True, upload_to=custom_profile_photo_upload_to)
    description = models.TextField(max_length=5000, null=True, blank=True)
    address = models.CharField(max_length=255, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    suite_number = models.CharField(max_length=255, null=True, blank=True)


    def __str__(self):
        return f"{self.user.get_full_name()}'s profile"
