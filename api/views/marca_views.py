from rest_framework import viewsets
from api.models import Marca
from rest_framework.parsers import MultiPartParser, FormParser
from api.serializers import MarcaSerializer



class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    parser_classes = [MultiPartParser, FormParser]
