from django.db import transaction
from django.utils import timezone
from api.models import MovimientoInventario, Inventario


# @transaction.atomic
# def mover_stock(
#     inventario: Inventario,
#     cantidad: int,
#     tipo: str,
#     motivo: str = '',
#     usuario: str = ''
# ):
#     if cantidad <= 0:
#         raise ValueError("La cantidad debe ser mayor a 0")

#     if tipo == 'SALIDA' and inventario.cantidad_actual < cantidad:
#         raise ValueError("Stock insuficiente")

#     # Crear movimiento
#     MovimientoInventario.objects.create(
#         inventario=inventario,
#         tipo=tipo,
#         cantidad=cantidad,
#         motivo=motivo,
#         usuario=usuario,
#         fecha=timezone.now()
#     )

#     # Actualizar inventario
#     if tipo == 'ENTRADA':
#         inventario.cantidad_actual += cantidad
#     else:
#         inventario.cantidad_actual -= cantidad

#     inventario.save()

