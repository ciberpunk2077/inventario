from openpyxl import Workbook
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.models import Inventario
from django.utils.timezone import now


class ReporteInventarioExcelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wb = Workbook()
        ws = wb.active
        ws.title = "Inventario"

        # Encabezados
        ws.append([
            "Producto",
            "Cantidad",
            "Precio compra",
            "Valor total"
        ])

        inventarios = Inventario.objects.select_related('producto')

        for inv in inventarios:
            ws.append([
                inv.producto.nombre,
                inv.cantidad_actual,
                inv.producto.precio_compra,
                inv.cantidad_actual * inv.producto.precio_compra
            ])

        # Respuesta HTTP
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

        filename = f"inventario_{now().date()}.xlsx"
        response['Content-Disposition'] = f'attachment; filename={filename}'

        wb.save(response)
        return response
