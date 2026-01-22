from rest_framework import serializers


class DashboardAlertaSerializer(serializers.Serializer):
    # producto = serializers.CharField()
    # stock_actual = serializers.IntegerField()
    # stock_minimo = serializers.IntegerField()

    producto = serializers.CharField()
    producto_id = serializers.IntegerField()
    stock_actual = serializers.IntegerField()
    stock_minimo = serializers.IntegerField()
    critico = serializers.BooleanField()

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

     # 🚨 ESTE ES EL CAMPO QUE TE FALTA
    alertas = DashboardAlertaSerializer(many=True)

     # valor_por_almacen 
    valor_por_almacen = serializers.ListField()
   
    valor_invertido = serializers.DecimalField(max_digits=14, decimal_places=2)
    valor_ganado = serializers.DecimalField(max_digits=14, decimal_places=2)

