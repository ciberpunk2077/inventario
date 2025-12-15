from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from django.db.models import F, Sum, DecimalField, ExpressionWrapper, Value
from rest_framework.decorators import api_view
from api.models import Producto
from django.db.models.functions import Coalesce
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from rest_framework.decorators import action
from rest_framework import status


from api.models import Inventario


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

@action(detail=True, methods=['post'])
def mover_stock(self, request, pk=None):
    producto = self.get_object()

    mover_stock(
        inventario=producto.inventario,
        cantidad=int(request.data['cantidad']),
        tipo=request.data['tipo'],
        motivo=request.data.get('motivo', ''),
        usuario=request.user.username
    )

    return Response({
        'cantidad_actual': producto.inventario.cantidad_actual
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

from .models import (
    Categoria, Proveedor, Producto, Inventario,
    MovimientoInventario, Compra, DetalleCompra,Marca
)

from .serializers import (
    CategoriaSerializer, ProveedorSerializer, ProductoSerializer,
    InventarioSerializer, MovimientoInventarioSerializer,
    CompraSerializer, DetalleCompraSerializer,MarcaSerializer
)
# from .serializers import MarcaSerializer
# from .models import Marca

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
class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    queryset = MovimientoInventario.objects.all().order_by('-fecha_movimiento')
    serializer_class = MovimientoInventarioSerializer

    def create(self, request, *args, **kwargs):
        """Aplicar el movimiento al inventario automáticamente"""
        datos = request.data
        producto_id = datos.get("producto")
        cantidad = int(datos.get("cantidad", 0))
        tipo = datos.get("tipo_movimiento")

        # Obtener inventario
        inventario = Inventario.objects.get(producto_id=producto_id)

        cantidad_anterior = inventario.cantidad_actual

        # Aplicar movimiento
        if tipo == "ENTRADA":
            inventario.cantidad_actual += cantidad
        elif tipo == "SALIDA":
            inventario.cantidad_actual -= cantidad
        elif tipo == "AJUSTE":
            inventario.cantidad_actual = cantidad
        else:
            return Response({"error": "Tipo no válido"}, status=400)

        inventario.save()

        # Guardar movimiento con cantidades antes y después
        datos["cantidad_anterior"] = cantidad_anterior
        datos["cantidad_nueva"] = inventario.cantidad_actual

        serializer = self.get_serializer(data=datos)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


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
    parser_classes = (MultiPartParser, FormParser)

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
        tipo = request.data.get("tipo", None)
        motivo = request.data.get("motivo", "AJUSTE")
        usuario = request.data.get("usuario", "Administrador")
        proveedor_id = request.data.get("proveedor")

        if cantidad <= 0:
            return Response({"error": "La cantidad debe ser mayor a 0"}, status=400)

        inventario, _ = Inventario.objects.get_or_create(
            producto=producto,
            defaults={'cantidad_actual': 0}
        )
        
        cantidad_anterior = inventario.cantidad_actual

        if tipo == "ENTRADA":
            cantidad_nueva = cantidad_anterior + cantidad
        elif tipo == "SALIDA":
            cantidad_nueva = cantidad_anterior - cantidad
        else:
            return Response({"error": "Tipo inválido"}, status=400)

        # Actualizar inventario
        inventario.cantidad_actual = cantidad_nueva
        inventario.save()

        # Registrar el movimiento
        MovimientoInventario.objects.create(
            producto=producto,
            tipo_movimiento=tipo,
            cantidad=cantidad,
            cantidad_anterior=cantidad_anterior,
            cantidad_nueva=cantidad_nueva,
            motivo=motivo,
            proveedor_id=proveedor_id,
            usuario_responsable=usuario
        )

        return Response({
            "mensaje": "Movimiento aplicado",
            "cantidad_anterior": cantidad_anterior,
            "cantidad_nueva": cantidad_nueva
        })



# 

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
