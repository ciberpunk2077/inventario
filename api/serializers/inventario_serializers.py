from rest_framework import serializers
from api.models import Inventario
      


class InventarioSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = Inventario
        fields = '__all__'