from rest_framework import serializers
from api.models import Marca

class MarcaSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()


    class Meta:
        model = Marca
        fields = ['id_marca',
            'nombre',
            'logo',
            'logo_url',
            'fecha_creacion',
            'activo']
        read_only_fields = ['activo', 'fecha_creacion']
        extra_kwargs = {
            'nombre': {
                'error_messages': {
                    'unique': 'Ya existe una marca con este nombre.',
                    'blank': 'El nombre no puede estar vacío.',
                    'required': 'El nombre es obligatorio.'
                }
            }
        }

    def get_logo_url(self, obj):
        request = self.context.get('request')
        if obj.logo and request:
            return request.build_absolute_uri(obj.logo.url)
        return None