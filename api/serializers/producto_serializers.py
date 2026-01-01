from rest_framework import serializers
from api.models import Producto


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    marca_nombre = serializers.CharField(source='marca.nombre', read_only=True)
    imagen_url = serializers.SerializerMethodField()
    cantidad_actual = serializers.SerializerMethodField()

    def get_cantidad_actual(self, obj):
        if hasattr(obj, 'inventario'):
            return obj.inventario.cantidad_actual
        return 0

    class Meta:
        model = Producto
        fields = '__all__'

    def get_imagen_url(self, obj):
        request = self.context.get('request')
        if obj.imagen and request:
            return request.build_absolute_uri(obj.imagen.url)
        return None