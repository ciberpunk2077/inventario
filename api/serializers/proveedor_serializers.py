from rest_framework import serializers
from api.models import Proveedor




class ProveedorSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Proveedor
        fields = '__all__'

    # def get_imagen_url(self, obj):
    #     if obj.imagen:
    #         return obj.imagen.url
    #     return None

    def get_imagen_url(self, obj):
        request = self.context.get('request')
        if obj.imagen and request:
            return request.build_absolute_uri(obj.imagen.url)
        return None