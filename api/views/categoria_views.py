
from rest_framework import viewsets, status
from api.models import Categoria
from api.serializers import CategoriaSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.filter(activo=True).order_by('nombre')
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]


    def destroy(self, request, *args, **kwargs):
        categoria = self.get_object()
        categoria.activo = False
        categoria.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def create(self, request, *args, **kwargs):
        nombre = request.data.get('nombre')
        descripcion = request.data.get('descripcion', '')

        # Buscar categoría existente (incluso si está inactiva)
        categoria_existente = Categoria.objects.filter(nombre=nombre).first()
        if categoria_existente:
            if not categoria_existente.activo:
                # “Revive” la categoría eliminada
                categoria_existente.activo = True
                categoria_existente.descripcion = descripcion
                categoria_existente.save()
                serializer = self.get_serializer(categoria_existente)
                return Response(serializer.data, status=status.HTTP_200_OK)
            # Ya existe activa
            return Response({'nombre': ['Ya existe una categoría activa con ese nombre.']}, status=status.HTTP_400_BAD_REQUEST)

        # Si no existe, crear normalmente
        return super().create(request, *args, **kwargs)