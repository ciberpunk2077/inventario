from rest_framework import serializers


class DashboardResumenSerializer(serializers.Serializer):
    """
    Serializer del dashboard.
    NO guarda datos, solo valida y documenta la respuesta.
    """

    total_productos = serializers.IntegerField()
    total_categorias = serializers.IntegerField()
    total_proveedores = serializers.IntegerField()

    stock_total = serializers.IntegerField()
    valor_inventario = serializers.DecimalField(
        max_digits=14,
        decimal_places=2
    )

    productos_bajo_stock = serializers.IntegerField()

    total_entradas = serializers.IntegerField()
    total_salidas = serializers.IntegerField()

    entradas_hoy = serializers.IntegerField()
    salidas_hoy = serializers.IntegerField()
    movimientos_hoy = serializers.IntegerField()
