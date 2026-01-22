from rest_framework import viewsets, status
from rest_framework.response import Response
from api.models import Proveedor
from api.serializers import ProveedorSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action

class ProveedorViewSet(viewsets.ModelViewSet):
    # queryset = Proveedor.objects.all()
    queryset = Proveedor.objects.filter(activo=True).order_by('nombre')
    serializer_class = ProveedorSerializer
    parser_classes = (MultiPartParser, FormParser)

    def destroy(self, request, *args, **kwargs):
        proveedor = self.get_object()       
        
        proveedor.activo = False
        proveedor.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
        # return Response({"message": "Proveedor desactivado"}, status=status.HTTP_204_OK)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=False, methods=['get'])
    def inactivos(self, request):
        qs = Proveedor.objects.filter(activo=False)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        nombre = request.data.get('nombre', '').strip()
        proveedor_existente = Proveedor.objects.filter(nombre__iexact=nombre).first()

        # proveedor_existente = Proveedor.objects.filter(nombre=nombre).first()

        if proveedor_existente:
            if not proveedor_existente.activo:
                proveedor_existente.activo = True

                if 'imagen' in request.data:
                    proveedor_existente.imagen = request.data['imagen']

                proveedor_existente.contacto = request.data.get('contacto')
                proveedor_existente.telefono = request.data.get('telefono')
                proveedor_existente.email = request.data.get('email')
                proveedor_existente.direccion = request.data.get('direccion')

                proveedor_existente.save()

                serializer = self.get_serializer(proveedor_existente)
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(
                {'nombre': ['Ya existe un proveedor activo con este nombre.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)

