from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.models import Inventario
from django.db import models


class AlertasStockMinimoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        inventarios = Inventario.objects.select_related('producto').filter(
            cantidad_actual__lt=models.F('producto__stock_minimo')
        )

        data = [
            # {
            #     "producto_id": inv.producto.id,
            #     "producto": inv.producto.nombre,
            #     "stock_actual": inv.cantidad_actual,
            #     "stock_minimo": inv.producto.stock_minimo
            # }
            {"producto": inv.producto.nombre, "cantidad_actual": inv.cantidad_actual}
            for inv in inventarios
        ]

        return Response(data)
