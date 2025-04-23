from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, serializers, permissions
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from users.constants import USER_TYPE_BUSINESS_MANAGER, USER_TYPE_BUSINESS_OWNER, USER_TYPE_CUSTOMER, USER_TYPE_PLATFORM_MANAGER, USER_TYPE_RIDER
from users.models import User
from users.permissions import AnonCreateAndUpdateOwnerOnly
from users.serializers import ChangePasswordSerializer, CustomTokenObtainPairSerializer, UserSerializer, SendPasswordResetCodeSerializer, \
    ResetPasswordSerializer
from drf_spectacular.utils import extend_schema, OpenApiExample
from drf_spectacular.types import OpenApiTypes

from vendors.models import VendorMember


# Create your views here.
class CustomObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny)
    serializer_class = CustomTokenObtainPairSerializer


@extend_schema(
    description=f"""
    API endpoint for managing users.
    
    Available user types:
    - {USER_TYPE_RIDER}: Rider user account
    - {USER_TYPE_CUSTOMER}: Customer user account
    - {USER_TYPE_BUSINESS_OWNER}: Business owner user account
    - {USER_TYPE_BUSINESS_MANAGER}: Platform manager user account
    """,
)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [AnonCreateAndUpdateOwnerOnly]
    # filter_backends = [DjangoFilterBackend]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ["username", "email"]
    filterset_fields = ["username", ]

    def get_queryset(self):
        user = self.request.user

        # # For customers, return only their orders
        # if user.user_type == USER_TYPE_RIDER:
        #     usr = User.objects.filter(pk=user.id)
        # For customers, return only their orders
        if user.user_type == USER_TYPE_CUSTOMER:
            return  User.objects.filter(pk=user.id)
        
        # For platform managers, return all orders
        if user.user_type == USER_TYPE_PLATFORM_MANAGER:
            return User.objects.all()
        if user.is_staff or user.is_superuser:
            return User.objects.all()
        
        # For business managers and owners, return users from their vendors
        if user.user_type in [USER_TYPE_BUSINESS_MANAGER, USER_TYPE_BUSINESS_OWNER]:
            # Get all vendors the user is a member of
            vendor_memberships = VendorMember.objects.filter(user=user).values_list('vendor', flat=True)
            vendor_user_ids = VendorMember.objects.filter(
                vendor__in=vendor_memberships
            ).select_related('user', 'vendor').values_list('user_id', flat=True)
            users = User.objects.filter(pk__in=vendor_user_ids)
            return users
        return User.objects.none()

    def partial_update(self, request, pk=None):
        try:
            auth_user = self.request.user

            if  auth_user.is_staff or auth_user.is_superuser:
                user =  User.objects.get(pk=pk)
            else:
                if int(pk) != int(auth_user.id):
                    # todo: allow business managers to change other users
                    raise serializers.ValidationError('User Cannot update this user')
                user = User.objects.get(pk=pk)
            serializer = self.get_serializer(user, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    @action(detail=False, methods=["get"], url_path="get-current-user", serializer_class=UserSerializer, )
    def get_current_user(self, request):
        user_id = self.request.user.id

        user_obj = User.objects.prefetch_related("profile").get(pk=user_id)
        context = {"request": request}
        return Response(UserSerializer(user_obj, context=context).data)

    @action(detail=False, methods=["post"], url_path="send-reset-link", permission_classes=[permissions.AllowAny],
            serializer_class=SendPasswordResetCodeSerializer, )
    def send_reset_password_code(self, request):
        serializer = SendPasswordResetCodeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        else:
            raise serializers.ValidationError(serializer.errors, code=400)
        return Response({"data": "Email Sent"})

    @action(detail=False, methods=["post"], url_path="reset-password", permission_classes=[permissions.AllowAny],
            serializer_class=ResetPasswordSerializer, )
    def reset_password(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response({"data": "Password Changed Successfully"})
    
    @action(
        methods=["POST"],
        permission_classes=[permissions.IsAuthenticated],
        detail=False,
        url_path="change-password",
        serializer_class=ChangePasswordSerializer
    )
    def change_password(self, request, *args, **kwargs):
        """
        Change user password.
        Request should contain:
        {
            "current_password": "oldpass123",
            "new_password": "newpass123"
        }
        """
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                raise serializers.ValidationError(serializer.errors)

            # Get validated data
            current_password = serializer.validated_data.get('current_password')
            new_password = serializer.validated_data.get('new_password')
            user = request.user

            # Check if current password is correct
            if not user.check_password(current_password):
                raise serializers.ValidationError("Current password is incorrect")


            # Set new password
            user.set_password(new_password)
            user.save()

            return Response(
                {
                    "error": False,
                    "data": None,
                    "msg": "Password changed successfully",
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            raise Response(
                {
                    "error": True,
                    "data": None,
                    "msg": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
