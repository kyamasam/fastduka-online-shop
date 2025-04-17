from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, email=None, password=None, is_staff=None, **kwargs):
        UserModel = get_user_model()
        try:
            if username is not None:
                user = UserModel.objects.get(email=username)
            if email is not None:
                user = UserModel.objects.get(email=email)

            if user.check_password(password):
                if is_staff is not None:
                    if user.is_staff == is_staff:
                        return user
                    else:
                        return None
                return user
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password):
                return user
        return None
