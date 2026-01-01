from django.utils import timezone
from django.db.models import Sum, F, DecimalField, ExpressionWrapper, Value
from django.db.models.functions import Coalesce
from django.core.cache import cache

from api.models import Producto, Inventario, Categoria, Proveedor, MovimientoInventario


class DashboardService:
    """
    Service del dashboard.
    Calcula métricas agregadas y las guarda en cache.
    NO es una view, NO es un serializer.
    """

    CACHE_KEY = "dashboard_resumen"
    CACHE_TIMEOUT = 60 * 3  # 3 minutos

    @staticmethod
    def obtener_resumen():
        # 1️⃣ Intentar obtener datos desde cache
        data = cache.get(DashboardService.CACHE_KEY)
        if data:
            return data

        hoy = timezone.now().date()

        # 2️⃣ Expresión para calcular valor total del inventario
        valor_expr = ExpressionWrapper(
            F("cantidad_actual") * F("producto__precio_compra"),
            output_field=DecimalField(max_digits=14, decimal_places=2)
        )

        # 3️⃣ Diccionario final que se enviará al frontend
        resultado = {
            "total_productos": Producto.objects.count(),
            "total_categorias": Categoria.objects.count(),
            "total_proveedores": Proveedor.objects.count(),

            "stock_total": Inventario.objects.aggregate(
                total=Coalesce(Sum("cantidad_actual"), Value(0))
            )["total"],

            "valor_inventario": Inventario.objects.aggregate(
                total=Coalesce(
                    Sum(valor_expr),
                    Value(0, output_field=DecimalField(max_digits=14, decimal_places=2))
                )
            )["total"],

            "productos_bajo_stock": Inventario.objects.filter(
                cantidad_actual__lte=F("producto__stock_minimo")
            ).count(),

            "total_entradas": MovimientoInventario.objects.filter(
                tipo_movimiento="ENTRADA"
            ).count(),

            "total_salidas": MovimientoInventario.objects.filter(
                tipo_movimiento="SALIDA"
            ).count(),

            "entradas_hoy": MovimientoInventario.objects.filter(
                tipo_movimiento="ENTRADA",
                fecha_movimiento__date=hoy
            ).count(),

            "salidas_hoy": MovimientoInventario.objects.filter(
                tipo_movimiento="SALIDA",
                fecha_movimiento__date=hoy
            ).count(),

            "movimientos_hoy": MovimientoInventario.objects.filter(
                fecha_movimiento__date=hoy
            ).count(),
        }

        # 4️⃣ Guardar en cache
        cache.set(
            DashboardService.CACHE_KEY,
            resultado,
            DashboardService.CACHE_TIMEOUT
        )

        return resultado
