from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from api.models import Producto, MovimientoInventario
from api.serializers.kardex_serializer import KardexSerializer
from api.permissions import PuedeVerMovimientos


class KardexProductoView(APIView):
    permission_classes = [IsAuthenticated, PuedeVerMovimientos]

    def get(self, request, producto_id):
        producto = get_object_or_404(Producto, id_producto=producto_id)

        movimientos = MovimientoInventario.objects.filter(
            producto=producto
        ).order_by('fecha_movimiento')

        serializer = KardexSerializer(movimientos, many=True)

        return Response({
            "producto": producto.nombre,
            "kardex": serializer.data
        })
