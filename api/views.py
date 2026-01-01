from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from django.db.models import F, Sum, DecimalField, ExpressionWrapper, Value
from rest_framework.decorators import api_view
from django.db.models.functions import Coalesce
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from django.db import transaction
from django.utils.timezone import now
from .models import ( Categoria, Proveedor, Producto, Inventario,
    MovimientoInventario, Compra, DetalleCompra,Marca )

from .serializers import ( CategoriaSerializer, ProveedorSerializer, ProductoSerializer,
    InventarioSerializer, MovimientoInventarioSerializer,
    CompraSerializer, DetalleCompraSerializer,MarcaSerializer )

from api.models import Inventario

from rest_framework import viewsets
from api.models import Categoria
from api.serializers import CategoriaSerializer


class ValorInventarioView(APIView):
    def get(self, request):
        total = Inventario.objects.aggregate(
            total=Coalesce(
                Sum(
                    ExpressionWrapper(
                        F('cantidad_actual') * F('producto__precio_compra'),
                        output_field=DecimalField(max_digits=14, decimal_places=2)
                    )
                ),
                Value(0, output_field=DecimalField(max_digits=14, decimal_places=2))
            )
        )

        return Response({
            "total": total["total"]
        })



@api_view(['GET'])
def valor_inventario(request):
    valor = Producto.objects.aggregate(
        total=Coalesce(
            Sum(F('precio_compra') * F('cantidad_actual')),
            0
        )
    )['total']

    return Response({
        'valor_inventario': float(valor)
    })




# ------------------------------
# Categoria
# ------------------------------
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

# ------------------------------
# Inventario
# ------------------------------
class InventarioViewSet(viewsets.ModelViewSet):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer

# ------------------------------
# Movimiento de Inventario
# ------------------------------
class MovimientoInventarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MovimientoInventario.objects.all().order_by('-fecha_movimiento')
    serializer_class = MovimientoInventarioSerializer

# ------------------------------
# Compra
# ------------------------------
class CompraViewSet(viewsets.ModelViewSet):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer

# ------------------------------
# Detalle de Compra
# ------------------------------
class DetalleCompraViewSet(viewsets.ModelViewSet):
    queryset = DetalleCompra.objects.all()
    serializer_class = DetalleCompraSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().select_related('categoria', 'proveedor', 'marca')
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
        motivo = request.data.get("motivo", "AJUSTE")
        # usuario = request.data.get("usuario", "Administrador")
        proveedor_id = request.data.get("proveedor")
        usuario = (request.user.username if request.user.is_authenticated else "Sistema"
    )

        if cantidad <= 0:
            return Response({"error": "La cantidad debe ser mayor a 0"}, status=400)

        proveedor = (Proveedor.objects.get(id_proveedor=proveedor_id) if proveedor_id else None
    )

        inventario, _ = Inventario.objects.get_or_create(
            producto=producto)
        
        try:
            movimiento = inventario.mover(
                cantidad=cantidad,
                tipo=tipo,
                motivo=motivo,
                proveedor=proveedor,
                usuario=usuario
            )
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "mensaje": "Movimiento aplicado correctamente",
            "movimiento": {
                "id": movimiento.id_movimiento,
                "tipo": movimiento.tipo_movimiento,
                "cantidad": movimiento.cantidad,
                "antes": movimiento.cantidad_anterior,
                "despues": movimiento.cantidad_nueva,
                "motivo": movimiento.motivo,
                "fecha": movimiento.fecha_movimiento,
                "usuario": movimiento.usuario_responsable
            }
        }, status=status.HTTP_201_CREATED)
            


# ------------------------------
# Marca
# ------------------------------
class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    parser_classes = [MultiPartParser, FormParser]


# ------------------------------
# Proveedor
# ------------------------------
class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    parser_classes = (MultiPartParser, FormParser)

    def destroy(self, request, *args, **kwargs):
        proveedor = self.get_object()
        
        # borrar imagen si existe
        if proveedor.imagen:
            proveedor.imagen.delete(save=False)

        proveedor.delete()
        return Response({"message": "Proveedor eliminado"}, status=200)
