from rest_framework import viewsets
from api.models import Proveedor
from api.serializers import ProveedorSerializer
from rest_framework.parsers import MultiPartParser, FormParser


class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    parser_classes = (MultiPartParser, FormParser)

    def destroy(self, request, *args, **kwargs):
        proveedor = self.get_object()
        
        # borrar imagen si existe
        if proveedor.imagen:
            proveedor.imagen.delete(save=False)

        proveedor.delete()
        return Response({"message": "Proveedor eliminado"}, status=status.HTTP_204_NO_CONTENT)
