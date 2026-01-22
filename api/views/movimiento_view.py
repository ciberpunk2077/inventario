
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404

from api.models import MovimientoInventario, Producto
from api.serializers import MovimientoInventarioSerializer
from api.serializers.movimiento_serializers import MovimientoInventarioReadSerializer
from api.models import Inventario
from api.permissions import PuedeVerMovimientos, PuedeCrearMovimiento
from django.core.cache import cache
from api.services.dashboard_service import DashboardService



class MovimientoInventarioViewSet(viewsets.ModelViewSet): #velo como RegistroMovimientos 
        
    # queryset = MovimientoInventario.objects.all().order_by('-fecha_movimiento')
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = MovimientoInventario.objects.all().order_by('-fecha_movimiento')

        tipo = self.request.query_params.get('tipo')
        if tipo:
            qs = qs.filter(tipo_movimiento=tipo)

        return qs

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return MovimientoInventarioReadSerializer
        return MovimientoInventarioSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated(), PuedeVerMovimientos()]
        elif self.action == 'create':
            return [IsAuthenticated(), PuedeCrearMovimiento()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        producto = serializer.validated_data['producto']

        inventario, _ = Inventario.objects.get_or_create(producto=producto)

        movimiento = inventario.mover(
            cantidad=serializer.validated_data['cantidad'],
            tipo=serializer.validated_data['tipo_movimiento'],
            motivo=serializer.validated_data['motivo'],
            proveedor=serializer.validated_data.get('proveedor', None),
            usuario=request.user
        )
        cache.delete(DashboardService.CACHE_KEY)

        return Response(
            {
                "id": movimiento.id_movimiento,
                "fecha": movimiento.fecha_movimiento.strftime("%Y-%m-%d %H:%M:%S"),
                "stock_nuevo": movimiento.cantidad_nueva
            },
            status=status.HTTP_201_CREATED
        )