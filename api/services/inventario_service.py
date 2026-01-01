from django.db import transaction

class InventarioService:

    @staticmethod
    @transaction.atomic
    def mover_stock(inventario, cantidad, tipo, **extra):
        if tipo == "ENTRADA":
            inventario.cantidad_actual += cantidad
        elif tipo == "SALIDA":
            if inventario.cantidad_actual < cantidad:
                raise ValueError("Stock insuficiente")
            inventario.cantidad_actual -= cantidad
        elif tipo == "AJUSTE":
            inventario.cantidad_actual = cantidad

        inventario.save()
        return inventario
