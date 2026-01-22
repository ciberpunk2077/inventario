from rest_framework.permissions import BasePermission, SAFE_METHODS

class PuedeVerMovimientos(BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm("api.puede_ver_movimientos")


class PuedeCrearMovimiento(BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm("api.puede_crear_movimiento")
