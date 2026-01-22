from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import MovimientoInventario, Inventario


DASHBOARD_CACHE_KEY = "dashboard_resumen"


# @receiver(post_save, sender=MovimientoInventario)
# def actualizar_inventario(sender, instance, created, **kwargs):
#     if not created:
#         return

#     inventario, _ = Inventario.objects.get_or_create(
#         producto=instance.producto,
#         defaults={'cantidad_actual': 0}
#     )

#     if instance.tipo_movimiento == 'ENTRADA':
#         inventario.cantidad_actual += instance.cantidad
#     elif instance.tipo_movimiento == 'SALIDA':
#         inventario.cantidad_actual -= instance.cantidad

#     inventario.save()

 
