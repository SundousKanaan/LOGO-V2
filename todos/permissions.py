from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Admins can view all objects.
    """

    def has_permission(self, request, view, obj):
        # If Admin
        if request.user and request.user.is_staff:
            return True

        # If the user is the owner of the object
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
            
        # If the user is the maker of the assignee of the object
        if hasattr(obj, 'assignee'):
            return obj.assignee == request.user

        # return False if neither condition is met
        return False
        