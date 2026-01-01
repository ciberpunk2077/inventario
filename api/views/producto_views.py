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



class ProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Producto.objects.select_related('categoria', 'proveedor', 'marca','inventario')
    serializer_class = ProductoSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        producto = serializer.save()
        Inventario.objects.get_or_create(producto=producto)
  
    def update(self, request, *args, **kwargs):
        partial = True  # siempre edición parcial
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        producto = serializer.save()

        return Response(serializer.data)
        
    @action(detail=True, methods=['post'], parser_classes=[JSONParser])
    def mover_stock(self, request, pk=None):
        producto = self.get_object()
        cantidad = int(request.data.get("cantidad", 0))
        tipo = request.data.get("tipo")
        proveedor_id = request.data.get("proveedor")
        motivo = request.data.get("motivo", "AJUSTE")
        
        if tipo not in ("ENTRADA", "SALIDA"):
            return error("Tipo de movimiento inválido")
        if cantidad <= 0:
            return error("Tipo de movimiento inválido")

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
                "usuario": movimiento.usuario_responsable
            },
         status=status.HTTP_201_CREATED)
            