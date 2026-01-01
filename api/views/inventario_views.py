from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, F, DecimalField, ExpressionWrapper, Value
from django.db.models.functions import Coalesce
from api.models import Inventario
from api.serializers import InventarioSerializer
from rest_framework.permissions import IsAuthenticated


class InventarioViewSet(viewsets.ModelViewSet):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer
    permission_classes = [IsAuthenticated]


class ValorInventarioView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        total = Inventario.objects.aggregate(
            total=Coalesce(
                Sum(
                    ExpressionWrapper(
                        F('cantidad_actual') * F('producto__precio_compra'),
                        output_field=DecimalField(max_digits=14, decimal_places=2)
                    )
                ),
                Value(0, output_field=DecimalField(max_digits=14, decimal_places=2))
            )
        )
        

        return Response({
            "total": total["total"]
        })
