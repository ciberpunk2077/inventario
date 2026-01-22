from rest_framework import serializers
from api.models import MovimientoInventario

class KardexSerializer(serializers.ModelSerializer):
    fecha = serializers.DateTimeField(
        source='fecha_movimiento',
        format="%Y-%m-%d %H:%M"
    )
    tipo = serializers.CharField(source='tipo_movimiento')
    stock_anterior = serializers.IntegerField(source='cantidad_anterior')
    stock_nuevo = serializers.IntegerField(source='cantidad_nueva')
    usuario = serializers.CharField(
        source='usuario_responsable.username',
        allow_null=True
    )

    class Meta:
        model = MovimientoInventario
        fields = [
            'fecha',
            'tipo',
            'cantidad',
            'stock_anterior',
            'stock_nuevo',
            'motivo',
            'usuario'
        ]
