
from rest_framework import viewsets
from api.models import Categoria
from api.serializers import CategoriaSerializer
from rest_framework.permissions import IsAuthenticated


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.order_by('nombre')
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]