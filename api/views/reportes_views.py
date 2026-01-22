from django.db.models import Sum, F
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.core.cache import cache

from api.models import Producto, Inventario, AlertaStock

@require_GET
def dashboard_resumen(request):
    # 🔹 Cache (opcional pero recomendado)
    cache_key = "dashboard_resumen"
    data = cache.get(cache_key)

    if data:
        return JsonResponse(data)

    # 🔢 Totales
    total_productos = Producto.objects.count()

    stock_total = Inventario.objects.aggregate(
        total=Sum("cantidad_actual")
    )["total"] or 0

    valor_inventario = Inventario.objects.aggregate(
        total=Sum(F("cantidad_actual") * F("producto__precio"))
    )["total"] or 0

    stock_bajo = AlertaStock.objects.filter(
        atendida=False
    ).count()

    alertas = list(
        AlertaStock.objects.filter(atendida=False)
        .select_related("producto")
        .values(
            producto=F("producto__nombre"),
            stock_actual=F("stock_actual")
        )
    )

    data = {
        "total_productos": total_productos,
        "stock_total": stock_total,
        "valor_inventario": round(valor_inventario, 2),
        "stock_bajo": stock_bajo,
        "alertas": alertas
    }

    # 🧠 Guardar en cache 60 segundos
    cache.set(cache_key, data, 60)

    return JsonResponse(data)

