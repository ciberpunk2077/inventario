from rest_framework import viewsets, status
from rest_framework.response import Response
from api.models import Marca
from rest_framework.parsers import MultiPartParser, FormParser
from api.serializers import MarcaSerializer


class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.filter(activo=True).order_by('nombre')
    serializer_class = MarcaSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


    def destroy(self, request, *args, **kwargs):
        marca = self.get_object()
        marca.activo = False
        marca.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    def create(self, request, *args, **kwargs):
        nombre = request.data.get('nombre', '').strip()
        marca_existente = Marca.objects.filter(nombre__iexact=nombre).first()


        # marca_existente = Marca.objects.filter(nombre=nombre).first()
        if marca_existente:
            if not marca_existente.activo:
                marca_existente.activo = True

                if 'logo' in request.data:
                    marca_existente.logo = request.data['logo']

                marca_existente.save()
                serializer = self.get_serializer(marca_existente)
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(
                {'nombre': ['Ya existe una marca activa con este nombre.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        nombre = request.data.get('nombre', '').strip()

        if nombre:
            # Buscar otra marca con el mismo nombre (case-insensitive)
            marca_existente = Marca.objects.filter(
                nombre__iexact=nombre
            ).exclude(pk=instance.pk).first()

            if marca_existente:
                return Response(
                    {'nombre': ['Ya existe otra marca con este nombre.']},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    
    

        

