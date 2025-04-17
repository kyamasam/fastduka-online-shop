from django.contrib import admin

from users.models import User, Profile
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "Other Fields",
            {
                "fields": (
                    "phone_code",
                    "phone_number",
                    "staff_number",
                    "password_reset_code",
                    "password_reset_code_expires_at",
                    "password_reset_code_used",
                    "user_type",
                    "last_withdrawal_transaction_complete",
                    "last_withdrawal_time",
                    "otp_code",
                    "otp_code_used",
                    "otp_code_expires_at",
                )
            },
        ),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Other Fields",
            {
                "fields": (
                    "phone_code",
                    "phone_number",
                    "staff_number",
                    "password_reset_code",
                    "password_reset_code_expires_at",
                    "password_reset_code_used",
                    "last_withdrawal_transaction_complete",
                    "last_withdrawal_time",
                )
            },
        ),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile)