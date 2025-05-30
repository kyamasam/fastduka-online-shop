from rest_framework import permissions


class OwnsUserProfile(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return view.action in ['retrieve', 'update', 'partial_update'] and obj.user.id == request.id or \
               request.user.is_superuser


class HasToOwnProfile(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return view.action in ['retrieve', 'update',
                               'partial_update', 'create'] \
               and obj.photographer_profile.user.id == request.user.id or request.user.is_superuser


class HasToOwnCart(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if view.action in ['retrieve', 'update', 'partial_update']:
            # get cart
            if obj.cart.user is not None:
                return obj.cart.user.id == request.user.id or request.user.is_superuser
            else:
                # anyone can edit a cart that has no user
                return True

class HasToOwnOrder(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if view.action in ['retrieve', 'update', 'partial_update']:
            # get cart
            if obj.order.user is not None:
                return obj.order.user.id == request.user.id or request.user.is_superuser
            else:
                # anyone can edit a cart that has no user
                return True

class AnonCreateAndUpdateOwnerOnly(permissions.BasePermission):
    """
    Custom permission:
        - allow anonymous POST
        - allow authenticated GET and PUT on *own* record
        - allow all actions for superuser
    """

    def has_permission(self, request, view):
        return view.action == 'create' or request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return view.action in ['retrieve', 'update',
                               'partial_update'] and obj.id == request.user.id or request.user.is_superuser


class AuthenticatedCreateAndUpdateOwnerOnly(permissions.BasePermission):
    """
    Custom permission:
        - allow anonymous POST
        - allow authenticated GET and PUT on *own* record
        - allow all actions for staff
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_staff or request.user.is_superuser


class AnonReadAdminCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff or request.user.is_superuser


class AdminOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.is_staff or user.is_superuser
