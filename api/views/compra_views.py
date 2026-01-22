from rest_framework import viewsets
from api.models import Compra
from api.models import Compra, DetalleCompra
from api.serializers import CompraSerializer, DetalleCompraSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from api.services.compra_service import CompraService



class CompraViewSet(viewsets.ModelViewSet):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer
    permission_classes = [IsAuthenticated]


class DetalleCompraViewSet(viewsets.ModelViewSet):
    queryset = DetalleCompra.objects.all()
    serializer_class = DetalleCompraSerializer
    permission_classes = [IsAuthenticated]



@action(detail=True, methods=["post"])
def completar(self, request, pk=None):
    compra = self.get_object()

    try:
        CompraService.completar_compra(
            compra=compra,
            usuario=request.user
        )
    except ValueError as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

    return Response(
        {"mensaje": "Compra completada e inventario actualizado"},
        status=status.HTTP_200_OK
    )