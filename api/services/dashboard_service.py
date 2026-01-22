from django.utils import timezone
from django.db.models import Sum, F, DecimalField, ExpressionWrapper, Value
from django.db.models.functions import Coalesce
from django.core.cache import cache
from django.db.models import F

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

        

        # 🚨 Productos bajo stock (detalle)
        inventarios_bajo_stock = Inventario.objects.select_related("producto").filter(
            producto__activo=True,
            cantidad_actual__lte=F("producto__stock_minimo")
        )

        alertas = [
            {
                "producto": inv.producto.nombre,
                "producto_id": inv.producto.pk,
                "stock_actual": inv.cantidad_actual,
                "stock_minimo": inv.producto.stock_minimo,
                "critico": inv.cantidad_actual <= (inv.producto.stock_minimo / 2)
            }
            for inv in inventarios_bajo_stock
        ]

        # 1️⃣ Intentar obtener datos desde cache
        # data = cache.get(DashboardService.CACHE_KEY)
        cache_key = DashboardService.get_cache_key()
        data = cache.get(cache_key)
        if data:
            return data

        hoy = timezone.now().date()      

        # 2️⃣ Expresión para calcular valor total del inventario
        valor_expr = ExpressionWrapper(
            F("cantidad_actual") * F("producto__precio_compra"),
            output_field=DecimalField(max_digits=14, decimal_places=2)
        )

        # 💰 Valor invertido (costo)
        valor_invertido_expr = ExpressionWrapper(
            F("cantidad_actual") * F("producto__precio_compra"),
            output_field=DecimalField(max_digits=14, decimal_places=2)
        )

        # 🟢 Valor potencial de venta (ganancia bruta)
        valor_venta_expr = ExpressionWrapper(
            F("cantidad_actual") * F("producto__precio_venta"),
            output_field=DecimalField(max_digits=14, decimal_places=2)
        )

        # 🏢 Valor de inventario por almacén
        valor_por_almacen = Inventario.objects.filter(
            producto__activo=True
        ).values(
            "almacen__nombre"
        ).annotate(
            valor=Coalesce(
                Sum(valor_expr),
                Value(0, output_field=DecimalField(max_digits=14, decimal_places=2))
            )
        ).order_by("almacen__nombre")

        # 3️⃣ Diccionario final que se enviará al frontend
        resultado = {
                       
            "total_productos": Producto.objects.filter(activo=True).count(),
            "total_categorias": Categoria.objects.count(),
            "total_proveedores": Proveedor.objects.count(),

            
            "stock_total": Inventario.objects.filter(
                producto__activo=True
            ).aggregate(
                total=Coalesce(Sum("cantidad_actual"), Value(0))
            )["total"],

            

            # 💰 Valor solo de inventario activo
            "valor_inventario": Inventario.objects.filter(
                producto__activo=True
            ).aggregate(
                total=Coalesce(
                    Sum(valor_expr),
                    Value(0, output_field=DecimalField(max_digits=14, decimal_places=2))
                )
            )["total"],
            
            # 🚨 Bajo stock solo activos
            "productos_bajo_stock": len(alertas),          

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

            "valor_por_almacen": list(valor_por_almacen),

            "alertas": alertas,

            "valor_invertido": Inventario.objects.filter(
                producto__activo=True
            ).aggregate(
                total=Coalesce(
                    Sum(valor_invertido_expr),
                    Value(0, output_field=DecimalField(max_digits=14, decimal_places=2))
                )
            )["total"],

            "valor_ganado": Inventario.objects.filter(
                producto__activo=True
            ).aggregate(
                total=Coalesce(
                    Sum(valor_venta_expr),
                    Value(0, output_field=DecimalField(max_digits=14, decimal_places=2))
                )
            )["total"],



        }

        # 4️⃣ Guardar en cache
        cache.set(
            DashboardService.CACHE_KEY,
            resultado,
            DashboardService.CACHE_TIMEOUT
        )

        return resultado
    


    @staticmethod
    def get_cache_key(ubicacion=None):
        return f"dashboard_resumen_{ubicacion or 'global'}"
    
    

