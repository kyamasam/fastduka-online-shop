import os
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.db import transaction
from django.template.loader import get_template
from django.utils import timezone
from django.utils.crypto import get_random_string
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from delivery.models import Rider
from users.constants import USER_TYPE_BUSINESS_MANAGER, USER_TYPE_BUSINESS_OWNER, USER_TYPE_CUSTOMER, USER_TYPE_RIDER
from users.models import User, Profile


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["is_superuser"] = user.is_superuser
        return token
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        """
        Validate the new password.
        Add any password validation rules here.
        """
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long")

        return value

class GroupSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField("get_value", read_only=True)
    label = serializers.SerializerMethodField("get_label", read_only=True)

    class Meta:
        model = Group
        fields = ["id", "name", "value", "label"]

    def get_value(self, obj):
        return obj.id

    def get_label(self, obj):
        return obj.name


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "tagline", "suite_number", "address",
                  "latitude","longitude","description", "profile_photo", 
                  "user_id", "cover_photo", "created_at", "updated_at"]
        read_only_fields = ["user_id", ]

    def create(self, validated_data):
        user = self.context["request"].user
        prof = Profile.objects.filter(user_id=user.id)
        if prof.count() > 0:
            new_prof = prof[0]
            new_prof.tagline = validated_data["tagline"]
            new_prof.description = validated_data["description"]
            new_prof.save()
            return new_prof
        else:
            Profile.objects.create(user=user, **validated_data)
        return Profile

    def update(self, instance, validated_data):
        profile = super().update(instance, validated_data)
        return profile


class UserSerializer(serializers.ModelSerializer):

    
    password = serializers.CharField(write_only=True, required=False,
                                     style={"input_type": "password", "placeholder": "Password"}, )
    groups_objects = serializers.SerializerMethodField("get_groups_objects", read_only=True)
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True, required=False)
    profile = ProfileSerializer(required=False)

    is_admin = serializers.SerializerMethodField()

    def get_is_admin(self, obj):
        return obj.is_superuser

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "password", "phone_code", "phone_number", "groups",
                  "groups_objects", "staff_number", "is_admin", "email", "profile", "user_type"]


    def validate(self, attrs):
        valid_user_types = [
            USER_TYPE_RIDER,
            USER_TYPE_CUSTOMER,
            USER_TYPE_BUSINESS_MANAGER,
            USER_TYPE_BUSINESS_OWNER
        ]
        user_type = attrs.get("user_type", None)
        if user_type is not None:
            if user_type not in valid_user_types:
                raise serializers.ValidationError("Invalid user type")
        
        return super().validate(attrs)




    def get_groups_objects(self, obj) -> list:
        return GroupSerializer(obj.groups, many=True).data

    @transaction.atomic
    def create(self, validated_data):
        # todo : prevent user from sending groups if they are not an admin user
        user_type = validated_data.pop("user_type", None)
        if user_type is None:
            user_type = USER_TYPE_CUSTOMER
        groups = validated_data.pop("groups", None)
        if not self.context["request"].user.is_staff:
            # cannot add groups since user is not admin
            groups = []
            staff_number = ""

        profile_data = validated_data.pop("profile", None)
        user = User.objects.create_user(user_type=user_type, **validated_data)

        if groups is not None:
            for group in groups:
                user.groups.add(group)
        # create the user Profile
        if profile_data is not None:
            Profile.objects.create(user=user, **profile_data)
        else:
            Profile.objects.create(user=user)
        user_type =  validated_data.pop("user_type", None)
        if user_type is not None:
            if user_type == USER_TYPE_RIDER:
                Rider.objects.create(user=user)
        # also return token
        return user

    def update(self, instance, validated_data):
        # discard user type during update
        user_type = validated_data.pop("user_type", None)
        groups = validated_data.pop("groups", None)
        password = validated_data.pop("password", None)

        try:
            staff_number = validated_data.pop("staff_number")
        except KeyError:
            pass
        if not self.context["request"].user.is_staff:
            # cannot add groups since user is not admin
            groups = None
        profile_data = validated_data.pop("profile", None)

        user = super().update(instance, validated_data)
        if password:
            hashed_password = make_password(password)
            user.password = hashed_password
            user.save()

        if groups is not None:
            user.groups.clear()
            for group in groups:
                user.groups.add(group)
        user.save()
        if profile_data is not None:
            # check if the user has a profile
            try:
                prof = user.profile
                profile_serializer = ProfileSerializer(prof, data=profile_data, partial=True)
                if profile_serializer.is_valid():
                    profile_serializer.save()
            except ObjectDoesNotExist:
                prof = Profile.objects.create(user=user, **profile_data)
                user.profile = prof
                user.save()

        return user


class MiniUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]


class ResetPasswordSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["email", "password_reset_code", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        try:
            user = User.objects.get(email=validated_data.get("email"),
                                    password_reset_code=validated_data.get("password_reset_code"), )
            now = timezone.now()
            if user.password_reset_code_expires_at < now:
                raise serializers.ValidationError("Password reset code is expired")
            if user.password_reset_code_used:
                raise serializers.ValidationError("Password reset code has already been used")

        except User.DoesNotExist:
            raise serializers.ValidationError("Code is invalid or user with that email does not exist")

        if password:
            hashed_password = make_password(password)
            user.password = hashed_password
            user.password_reset_code_used = True
            user.save()
            message = get_template("emails/passwordChangeSuccess.html").render(
                {"project_name": os.environ.get("PROJECT_NAME")})
            mail = EmailMessage(subject="Password Changed Successfully", body=message,
                                from_email=os.environ.get("EMAIL_HOST_USER"), to=[user.email], )
            mail.content_subtype = "html"
            mail.send()
        return User


class SendPasswordResetCodeSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    class Meta:
        fields = ["email"]

    def create(self, validated_data):
        email = validated_data.pop("email")
        # send this code via email
        try:
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return validated_data  # raise serializers.ValidationError("That Email does not exist")
        password_reset_code = get_random_string(length=12)
        user.password_reset_code = password_reset_code
        user.password_reset_code_used = False

        # now

        now = timezone.now()
        future_date = now + timedelta(hours=settings.PASSWORD_RESET_TIMEOUT["hours"],
                                      days=settings.PASSWORD_RESET_TIMEOUT["days"], )
        user.password_reset_code_expires_at = future_date
        user.save()
        fe_link = os.environ.get('FRONT_END_LINK')
        if fe_link[-1] != '/':
            fe_link += '/'
        message = get_template("emails/passwordReset.html").render(
            {"expiry_date": future_date, "front_end_link": os.environ.get("FRONT_END_LINK"),
             "password_reset_code": password_reset_code, "action_url": f"{fe_link}renew-password/{password_reset_code}",
             "project_name": os.environ.get("PROJECT_NAME"), })
        mail = EmailMessage(subject="Password Reset Request", body=message,
                            from_email=os.environ.get("EMAIL_HOST_USER"), to=[email], )
        mail.content_subtype = "html"
        mail.send()

        return user
