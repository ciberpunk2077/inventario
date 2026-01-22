from django.db import transaction
from django.utils import timezone
from api.models import Compra, Inventario, MovimientoInventario

class CompraService:

    @staticmethod
    @transaction.atomic
    def completar_compra(compra: Compra, usuario):
        if compra.estado != "PENDIENTE":
            raise ValueError("Solo se puede completar una compra pendiente")

        detalles = compra.detalles.select_related("producto")

        if not detalles.exists():
            raise ValueError("No se puede completar una compra sin productos")

        # 1️⃣ Generar movimientos de inventario
        for d in detalles:
            inventario, _ = Inventario.objects.get_or_create(
                producto=d.producto
            )

            inventario.mover(
                cantidad=d.cantidad,
                tipo="ENTRADA",
                motivo=f"COMPRA #{compra.id_compra}",
                proveedor=compra.proveedor,
                usuario=usuario
            )

        # 2️⃣ Cerrar compra
        compra.estado = "COMPLETADA"
        compra.fecha_actualizacion = timezone.now()
        compra.save()

        return compra
