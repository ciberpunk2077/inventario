from rest_framework import serializers
from api.models import Categoria


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'
        extra_kwargs = {
            'nombre': {
                'required': True,
                'error_messages': {
                    'blank': 'El nombre de la categoría es obligatorio.',
                    'required': 'El nombre de la categoría es obligatorio.'
                }
            }
        }
