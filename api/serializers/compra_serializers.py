from rest_framework import serializers
from api.models import Compra, DetalleCompra



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