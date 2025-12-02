from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
import os

def producto_imagen_path(instance, filename):
    # Guardar imagen en: media/productos/id_producto/filename
    return f'productos/{instance.id_producto}/{filename}'

def proveedor_imagen_path(instance, filename):
    # Guardar imagen en: media/proveedores/id_proveedor/filename
    return f'proveedores/{instance.id_proveedor}/{filename}'

def marca_logo_path(instance, filename):
    return f'marcas/{instance.id_marca}/{filename}'

class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'categorias'
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.nombre

class Proveedor(models.Model):
    id_proveedor = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    contacto = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to='proveedor/', blank=True, null=True)
    fecha_registro = models.DateTimeField(default=timezone.now)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'proveedores'
        verbose_name_plural = "Proveedores"

    def __str__(self):
        return self.nombre


class Marca(models.Model):
    id_marca = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200, unique=True)
    logo = models.ImageField(upload_to='marcas/', blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'marcas'
        verbose_name_plural = 'Marcas'

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    codigo_barras = models.CharField(max_length=50, unique=True, blank=True, null=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True, blank=True)
    marca = models.ForeignKey(Marca, on_delete=models.SET_NULL, null=True, blank=True)
    imagen = models.ImageField(upload_to=producto_imagen_path, blank=True, null=True)
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    stock_minimo = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    stock_maximo = models.IntegerField(default=100, validators=[MinValueValidator(0)])
    unidad_medida = models.CharField(max_length=20, blank=True, null=True)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'productos'
        verbose_name_plural = "Productos"

    def __str__(self):
        return self.nombre

    @property
    def cantidad_actual(self):
        try:
            return self.inventario.cantidad_actual
        except Inventario.DoesNotExist:
            return 0

class Inventario(models.Model):
    id_inventario = models.AutoField(primary_key=True)
    producto = models.OneToOneField(Producto, on_delete=models.CASCADE, related_name='inventario')
    cantidad_actual = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    ubicacion = models.CharField(max_length=100, blank=True, null=True)
    fecha_ultima_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventario'
        verbose_name_plural = "Inventarios"

    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad_actual}"

class MovimientoInventario(models.Model):
    TIPO_MOVIMIENTO = [
        ('ENTRADA', 'Entrada'),
        ('SALIDA', 'Salida'),
        ('AJUSTE', 'Ajuste'),
    ]

    MOTIVO_MOVIMIENTO = [
        ('COMPRA', 'Compra'),
        ('VENTA', 'Venta'),
        ('DONACION', 'Donación'),
        ('DANADO', 'Dañado'),
        ('CADUCADO', 'Caducado'),
        ('AJUSTE', 'Ajuste'),
    ]

    id_movimiento = models.AutoField(primary_key=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    tipo_movimiento = models.CharField(max_length=10, choices=TIPO_MOVIMIENTO)
    cantidad = models.IntegerField()
    cantidad_anterior = models.IntegerField()
    cantidad_nueva = models.IntegerField()
    motivo = models.CharField(max_length=10, choices=MOTIVO_MOVIMIENTO)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_movimiento = models.DateTimeField(default=timezone.now)
    usuario_responsable = models.CharField(max_length=100)
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'movimientos_inventario'
        verbose_name_plural = "Movimientos de Inventario"

    def __str__(self):
        return f"{self.tipo_movimiento} - {self.producto.nombre}"

class Compra(models.Model):
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('COMPLETADA', 'Completada'),
        ('CANCELADA', 'Cancelada'),
    ]

    id_compra = models.AutoField(primary_key=True)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    numero_factura = models.CharField(max_length=100, blank=True, null=True)
    fecha_compra = models.DateField()
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='PENDIENTE')
    fecha_registro = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'compras'
        verbose_name_plural = "Compras"

    def __str__(self):
        return f"Compra #{self.id_compra} - {self.proveedor.nombre}"

class DetalleCompra(models.Model):
    id_detalle = models.AutoField(primary_key=True)
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField(validators=[MinValueValidator(1)])
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'detalle_compra'
        verbose_name_plural = "Detalles de Compra"

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad} unidades"