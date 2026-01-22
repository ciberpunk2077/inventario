from rest_framework import serializers
from api.models import Proveedor

class ProveedorSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Proveedor
        fields = '__all__'
        read_only_fields = ['activo', 'fecha_registro']
        extra_kwargs = {
            'nombre': {
                'required': True,
                'error_messages': {
                    'blank': 'El nombre del proveedor no puede estar vacío.',
                    'required': 'El nombre del proveedor es obligatorio.'
                }
            }
        }

    def get_imagen_url(self, obj):
        request = self.context.get('request')
        if obj.imagen and request:
            return request.build_absolute_uri(obj.imagen.url)
        return None