
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404

from api.models import MovimientoInventario, Producto
from api.serializers import MovimientoInventarioSerializer
from api.serializers.movimiento_serializers import MovimientoInventarioReadSerializer
from api.models import Inventario


class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    
    
    queryset = MovimientoInventario.objects.all().order_by('-fecha_movimiento')
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return MovimientoInventarioReadSerializer
        return MovimientoInventarioSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # producto = get_object_or_404(
        #     Producto,
        #     id_producto=serializer.validated_data['producto'].id_producto
        # )
        producto = serializer.validated_data['producto']

        inventario, _ = Inventario.objects.get_or_create(producto=producto)

        movimiento = inventario.mover(
            cantidad=serializer.validated_data['cantidad'],
            tipo=serializer.validated_data['tipo_movimiento'],
            motivo=serializer.validated_data['motivo'],
            proveedor=serializer.validated_data.get('proveedor', None),
            usuario=request.user
        )

        return Response(
            {
                "id": movimiento.id_movimiento,
                "fecha": movimiento.fecha_movimiento.strftime("%Y-%m-%d %H:%M:%S"),
                "stock_nuevo": movimiento.cantidad_nueva
            },
            status=status.HTTP_201_CREATED
        )