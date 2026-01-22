from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

from api.models import Producto, Inventario, Proveedor
from api.serializers import ProductoSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from api.utils.responses import success, error

from api.models import MovimientoInventario
from api.serializers.movimiento_serializers import MovimientoInventarioReadSerializer
from api.permissions import PuedeVerMovimientos
from django.core.cache import cache



class ProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Producto.objects.filter(activo=True).select_related('categoria', 'proveedor', 'marca','inventario')
    # queryset = Producto.objects.filter(activo=True).select_related('categoria', 'proveedor', 'marca').prefetch_related('inventario')
    serializer_class = ProductoSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        producto = serializer.save()
        Inventario.objects.get_or_create(producto=producto)
  
        
    @action(detail=True, methods=['post'], parser_classes=[JSONParser])
    def mover_stock(self, request, pk=None):
        producto = self.get_object()
        cantidad = int(request.data.get("cantidad", 0))
        tipo = request.data.get("tipo")
        proveedor_id = request.data.get("proveedor_id")
        motivo = request.data.get("motivo", "AJUSTE")
        
        if tipo not in ("ENTRADA", "SALIDA"):
            return error("Tipo de movimiento inválido")
        
        if cantidad <= 0:
            return error("La cantidad debe ser mayor a cero")

        proveedor = (
            get_object_or_404(Proveedor, id_proveedor=proveedor_id)
            if proveedor_id else None
        )
        usuario = (
            request.user.username 
            if request.user.is_authenticated 
            else "Sistema"
        )

        inventario, _ = Inventario.objects.get_or_create(producto=producto)
                
        try:
            movimiento = inventario.mover(
                cantidad=cantidad,
                tipo=tipo,
                motivo=motivo,
                proveedor=proveedor,
                usuario=usuario
            )
        except ValueError as e:
            return error(str(e))
        
        cache.delete("dashboard_resumen")
            

        return success(
            mensaje= "Movimiento aplicado correctamente",
            data= {
                "id": movimiento.id_movimiento,
                "tipo": movimiento.tipo_movimiento,
                "cantidad": movimiento.cantidad,
                "antes": movimiento.cantidad_anterior,
                "despues": movimiento.cantidad_nueva,
                "motivo": movimiento.motivo,
                "fecha": movimiento.fecha_movimiento,
                "usuario": movimiento.usuario_responsable.username if movimiento.usuario_responsable else None
                # "usuario": movimiento.usuario_responsable
            },
         status=status.HTTP_201_CREATED)
    

    @action(
        detail=True,
        methods=['get'],
        url_path='movimientos',
        permission_classes=[IsAuthenticated, PuedeVerMovimientos]
    )
    def movimientos(self, request, pk=None):
        producto = self.get_object()

        movimientos = MovimientoInventario.objects.filter(
            producto=producto
        ).order_by('-fecha_movimiento')

        serializer = MovimientoInventarioReadSerializer(movimientos, many=True,context={'request': request})
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        producto = self.get_object()
        producto.activo = False
        producto.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

            