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

    class Meta:
        model = MovimientoInventario
        fields = '__all__'

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