from rest_framework import serializers
from api.models import MovimientoInventario, Producto, Proveedor

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
        # fields = [
        #     'id_movimiento',
        #     'producto',
        #     'tipo_movimiento',
        #     'cantidad',
        #     'cantidad_anterior',
        #     'cantidad_nueva',
        #     'motivo',
        #     'proveedor',
        #     'fecha_movimiento',
        #     'observaciones',
        #     'usuario_responsable',
        # ]
        # read_only_fields = [
        #     'id_movimiento',
        #     'fecha_movimiento',
        #     'usuario_responsable',
        # ]
        fields = [
            'producto_id', 'tipo', 'cantidad', 'motivo',
            'observaciones', 'proveedor_id'
        ]


class MovimientoInventarioReadSerializer(serializers.ModelSerializer):
    producto = serializers.CharField(source='producto.nombre', read_only=True)
    tipo = serializers.CharField(source='tipo_movimiento')
    fecha = serializers.DateTimeField(
        source='fecha_movimiento',
        format="%Y-%m-%d %H:%M"
    )

    class Meta:
        model = MovimientoInventario
        fields = [
            'id_movimiento',
            'producto',
            'tipo',
            'cantidad',
            'motivo',
            'fecha'
        ]

