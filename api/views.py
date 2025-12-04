from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

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
# Producto
# ------------------------------
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


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


class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().select_related('categoria', 'proveedor')
    serializer_class = ProductoSerializer

    def create(self, request, *args, **kwargs):
        # Para manejar FormData desde Angular
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().select_related('categoria', 'proveedor')
    serializer_class = ProductoSerializer
    parser_classes = (MultiPartParser, FormParser)  # 👈 NECESARIO PARA GUARDAR IMÁGENES

    def perform_create(self, serializer):
        producto = serializer.save()
        # Crear inventario automáticamente
        Inventario.objects.create(
            producto=producto,
            cantidad_actual=0
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        producto = serializer.save()

        # Crear inventario si no existe
        Inventario.objects.get_or_create(producto=producto)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        producto = serializer.save()

        return Response(serializer.data)
    

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
