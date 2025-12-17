from rest_framework import serializers
from .models import Categoria, Proveedor, Producto, Inventario, MovimientoInventario, Compra, DetalleCompra
from .models import Marca

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProveedorSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Proveedor
        fields = '__all__'

    def get_imagen_url(self, obj):
        if obj.imagen:
            return obj.imagen.url
        return None

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    marca_nombre = serializers.CharField(source='marca.nombre', read_only=True)
    imagen_url = serializers.SerializerMethodField()
    cantidad_actual = serializers.IntegerField(source='inventario.cantidad_actual', read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'

    def get_imagen_url(self, obj):
        if obj.imagen:
            return obj.imagen.url
        return None


class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = '__all__'
        extra_kwargs = {
            'nombre': {
                'error_messages': {
                    'unique': 'Ya existe una marca con este nombre.',
                    'blank': 'El nombre no puede estar vacío.',
                    'required': 'El nombre es obligatorio.'
                }
            }
        }

    
class InventarioSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = Inventario
        fields = '__all__'

class MovimientoInventarioSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    producto_marca = serializers.CharField(source='producto.marca', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)  # si tu modelo User tiene username
    fecha = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)      # formato legible
    comentario = serializers.CharField(allow_blank=True, read_only=True)

    class Meta:
        model = MovimientoInventario
        fields = '__all__'



# class MovimientoInventarioSerializer(serializers.ModelSerializer):
#     # 🔑 ID del producto (para routerLink)
#     id_producto = serializers.IntegerField(source='producto.id_producto', read_only=True)

#     # 🔤 Nombre del producto
#     productoNombre = serializers.CharField(
#         source='producto.nombre',
#         read_only=True
#     )

#     # 🏷️ Marca (OJO: accedemos a marca.nombre)
#     productoMarca = serializers.CharField(
#         source='producto.marca.nombre',
#         read_only=True
#     )

#     # 👤 Usuario
#     usuarioNombre = serializers.CharField(
#         source='usuario_responsable',
#         read_only=True
#     )

#     # 📅 Fecha formateada
#     fecha = serializers.DateTimeField(
#         source='fecha_movimiento',
#         format="%Y-%m-%d %H:%M:%S",
#         read_only=True
#     )

#     class Meta:
#         model = MovimientoInventario
#         fields = [
#             'id_movimiento',
#             'id_producto',
#             'productoNombre',
#             'productoMarca',
#             'cantidad',
#             'tipo_movimiento',
#             'motivo',
#             'usuarioNombre',
#             'fecha',
#             'observaciones',
#         ]






class DetalleCompraSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = DetalleCompra
        fields = '__all__'

class CompraSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    detalles = DetalleCompraSerializer(many=True, read_only=True)

    class Meta:
        model = Compra
        fields = '__all__'