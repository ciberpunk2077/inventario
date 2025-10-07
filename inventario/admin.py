from django.contrib import admin
from .models import Categoria, Producto, MovimientoInventario, Proveedor

# Registrar Categoría
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'fecha_creacion')
    search_fields = ('nombre',)

# Registrar Producto
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'nombre', 'categoria', 'precio_compra', 'precio_venta', 'stock_actual', 'stock_minimo', 'activo', 'fecha_creacion', 'fecha_actualizacion')
    list_filter = ('categoria', 'activo')
    search_fields = ('codigo', 'nombre')
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')

# Registrar Movimiento de Inventario
@admin.register(MovimientoInventario)
class MovimientoInventarioAdmin(admin.ModelAdmin):
    list_display = ('producto', 'tipo', 'cantidad', 'cantidad_anterior', 'cantidad_nueva', 'usuario', 'fecha_movimiento')
    list_filter = ('tipo', 'usuario')
    search_fields = ('producto__nombre',)
    readonly_fields = ('fecha_movimiento',)

# Registrar Proveedor
@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'contacto', 'telefono', 'email', 'activo')
    search_fields = ('nombre', 'contacto')
    list_filter = ('activo',)
