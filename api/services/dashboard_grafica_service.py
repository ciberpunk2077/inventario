from django.utils import timezone
from datetime import timedelta
from api.models import MovimientoInventario

class DashboardGraficaService:

    @staticmethod
    def movimientos_7_dias():
        hoy = timezone.now().date()
        labels = []
        entradas = []
        salidas = []

        for i in range(6, -1, -1):
            dia = hoy - timedelta(days=i)
            labels.append(dia.strftime("%d/%m"))

            entradas.append(
                MovimientoInventario.objects.filter(
                    tipo_movimiento="ENTRADA",
                    fecha_movimiento__date=dia
                ).count()
            )

            salidas.append(
                MovimientoInventario.objects.filter(
                    tipo_movimiento="SALIDA",
                    fecha_movimiento__date=dia
                ).count()
            )

        return {
            "labels": labels,
            "entradas": entradas,
            "salidas": salidas
        }
