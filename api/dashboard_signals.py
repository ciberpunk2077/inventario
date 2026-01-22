from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from api.models import Producto, Inventario, MovimientoInventario
from api.services.dashboard_service import DashboardService
from api.models import Producto, Inventario, MovimientoInventario, Categoria, Proveedor



DASHBOARD_CACHE_KEY = "dashboard_resumen"


def limpiar_cache_dashboard():
    cache.delete(DASHBOARD_CACHE_KEY)


@receiver(post_save, sender=Producto)
@receiver(post_delete, sender=Producto)

@receiver(post_save, sender=Inventario)
@receiver(post_delete, sender=Inventario)

@receiver(post_save, sender=MovimientoInventario)
@receiver(post_delete, sender=MovimientoInventario)

@receiver(post_save, sender=Categoria)
@receiver(post_delete, sender=Categoria)

@receiver(post_save, sender=Proveedor)
@receiver(post_delete, sender=Proveedor)
def dashboard_cache_invalidate(sender, **kwargs):
    limpiar_cache_dashboard()

@receiver(post_save, sender=Producto)
def crear_inventario(sender, instance, created, **kwargs):
    if created:
        Inventario.objects.create(producto=instance, cantidad_actual=0)