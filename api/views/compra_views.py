from rest_framework import viewsets
from api.models import Compra
from api.models import Compra, DetalleCompra
from api.serializers import CompraSerializer, DetalleCompraSerializer
from rest_framework.permissions import IsAuthenticated



class CompraViewSet(viewsets.ModelViewSet):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer
    permission_classes = [IsAuthenticated]


class DetalleCompraViewSet(viewsets.ModelViewSet):
    queryset = DetalleCompra.objects.all()
    serializer_class = DetalleCompraSerializer
    permission_classes = [IsAuthenticated]