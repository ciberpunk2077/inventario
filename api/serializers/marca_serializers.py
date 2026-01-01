from rest_framework import serializers
from api.models import Marca



class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = '__all__'
        extra_kwargs = {
            'nombre': {
                'error_messages': {
                    'unique': 'Ya existe una marca con este nombre.',
                    'blank': 'El nombre no puede estar vacío.',
                    'required': 'El nombre es obligatorio.'
                }
            }
        }