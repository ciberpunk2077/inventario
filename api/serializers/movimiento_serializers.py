from rest_framework import serializers
from api.models import MovimientoInventario, Producto, Proveedor
# from api.serializers import ProveedorSerializer
from api.serializers.proveedor_serializers import ProveedorSerializer


class MovimientoInventarioSerializer(serializers.ModelSerializer):
    producto_id = serializers.PrimaryKeyRelatedField(
        source='producto', queryset=Producto.objects.all()
    )
    proveedor_id = serializers.PrimaryKeyRelatedField(
        source='proveedor', queryset=Proveedor.objects.all(), required=False, allow_null=True
    )
    tipo = serializers.CharField(source='tipo_movimiento')

    class Meta:
        model = MovimientoInventario
        fields = [
            'producto_id', 'tipo', 'cantidad', 'motivo',
            'observaciones', 'proveedor_id'
        ]


class MovimientoInventarioReadSerializer(serializers.ModelSerializer):
    producto = serializers.CharField(source='producto.nombre', read_only=True)
    tipo = serializers.CharField(source='tipo_movimiento')
    proveedor = serializers.SerializerMethodField()
    usuario = serializers.SerializerMethodField()
    fecha = serializers.DateTimeField(source='fecha_movimiento')

    class Meta:
        model = MovimientoInventario
        fields = [
            'id_movimiento',
            'producto',
            'tipo',
            'cantidad',
            'motivo',
            'proveedor',
            'usuario',
            'fecha',
        ]

    def get_proveedor(self, obj):
        if obj.proveedor:
            return ProveedorSerializer(
                obj.proveedor,
                context=self.context
            ).data
        return None

    def get_usuario(self, obj):
        return obj.usuario_responsable.username if obj.usuario_responsable else None

