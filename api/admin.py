from django.contrib import admin
from .models import Producto, Marca, Proveedor, Inventario


# Register your models here.
admin.site.register(Producto)
admin.site.register(Marca)
admin.site.register(Proveedor)
admin.site.register(Inventario)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'activo', 'fecha_creacion')
    search_fields = ('nombre',)
    list_filter = ('activo',)