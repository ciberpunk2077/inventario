from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth.models import AbstractUser
from django.db import transaction
from django.db.models import Sum



def producto_imagen_path(instance, filename):
    # Guardar imagen en: media/productos/id_producto/filename
    return f'productos/{instance.id_producto}/{filename}'

def proveedor_imagen_path(instance, filename):
    # Guardar imagen en: media/proveedores/id_proveedor/filename
    return f'proveedores/{instance.id_proveedor}/{filename}'

def marca_logo_path(instance, filename):
    return f'marcas/{instance.id_marca}/{filename}'


class Usuario(AbstractUser):
    ROLES = (
        ('ADMIN', 'Administrador'),
        ('CAPT', 'Capturista'),
        ('USER', 'Usuario normal'),
    )
    rol = models.CharField(max_length=5, choices=ROLES, default='USER')

    def __str__(self):
        return self.username


class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    activo = models.BooleanField(default=True)
    codigo = models.CharField(max_length=5, unique=True, null=True, blank=True)

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
    imagen = models.ImageField(upload_to=proveedor_imagen_path, blank=True, null=True)
    fecha_registro = models.DateTimeField(default=timezone.now)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'proveedores'
        verbose_name_plural = "Proveedores"

    def __str__(self):
        return self.nombre

    # 🔥 ELIMINAR ARCHIVO AL BORRAR REGISTRO
    def delete(self, *args, **kwargs):
        if self.imagen:
            self.imagen.delete(save=False)
        super().delete(*args, **kwargs)

    # 🌀 ELIMINAR ARCHIVO VIEJO AL ACTUALIZAR
    def save(self, *args, **kwargs):
        try:
            proveedor_ant = Proveedor.objects.get(pk=self.pk)
            if proveedor_ant.imagen and proveedor_ant.imagen != self.imagen:
                proveedor_ant.imagen.delete(save=False)
        except Proveedor.DoesNotExist:
            pass

        super().save(*args, **kwargs)

    
    


class Marca(models.Model):
    id_marca = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200, unique=True)
    logo = models.ImageField(upload_to=marca_logo_path, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'marcas'
        verbose_name_plural = 'Marcas'

    def __str__(self):
        return self.nombre
    
     # 🔥 ELIMINAR ARCHIVO AL BORRAR REGISTRO
    
    def delete(self, *args, **kwargs):
        if self.logo:
            self.logo.delete(save=False)
        super().delete(*args, **kwargs)

    # 🌀 ELIMINAR ARCHIVO VIEJO AL ACTUALIZAR
    def save(self, *args, **kwargs):
        try:
            marca_antigua = Marca.objects.get(pk=self.pk)
            if marca_antigua.logo and marca_antigua.logo != self.logo:
                marca_antigua.logo.delete(save=False)
        except Marca.DoesNotExist:
            pass

        super().save(*args, **kwargs)

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
    sku = models.CharField(max_length=20, unique=True, blank=True,  null=True)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)
    unidad_medida = models.CharField(
        max_length=50,
        choices=[
            ('pieza', 'Pieza'),
            ('caja', 'Caja'),
            ('kg', 'Kilogramo'),
            ('lt', 'Litro'),
            ('m', 'Metro'),
        ],
           default='pieza'
    )

    


    class Meta:
        db_table = 'productos'
        verbose_name_plural = "Productos"

    def __str__(self):
        return self.nombre
    
    def delete(self, *args, **kwargs):
        if self.imagen:
            self.imagen.delete(save=False)
        super().delete(*args, **kwargs)

    
    def save(self, *args, **kwargs):
        with transaction.atomic():
            # 🖼️ Borrar imagen anterior si cambia
            if self.pk:
                try:
                    producto_ant = Producto.objects.get(pk=self.pk)
                    if producto_ant.imagen and producto_ant.imagen != self.imagen:
                        producto_ant.imagen.delete(save=False)
                except Producto.DoesNotExist:
                    pass

           
            if not self.sku:
                if not self.categoria:
                    raise ValueError("El producto debe tener una categoría para generar el SKU")

                prefijo = self.categoria.nombre[:4].upper()

                # Último producto de esa categoría
                last = (
                    Producto.objects
                    .filter(categoria=self.categoria, sku__startswith=prefijo)
                    .order_by('id_producto')
                    .last()
                )

                if last and last.sku:
                    try:
                        last_number = int(last.sku.split('-')[1])
                    except (IndexError, ValueError):
                        last_number = 0
                else:
                    last_number = 0

                next_number = last_number + 1
                self.sku = f"{prefijo}-{str(next_number).zfill(6)}"

            super().save(*args, **kwargs)


   

    
    def stock_bajo(self):
        try:
            return self.inventario.cantidad_actual <= self.stock_minimo
        except Inventario.DoesNotExist:
            return True

    @property
    def cantidad_actual(self):
        try:
            return self.inventario.cantidad_actual
        except Inventario.DoesNotExist:
            return 0
        

class Almacen(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = "almacen"
        verbose_name_plural = "Almacenes"

    def __str__(self):
        return self.nombre



class Inventario(models.Model):
    id_inventario = models.AutoField(primary_key=True)
    producto = models.OneToOneField(Producto, on_delete=models.CASCADE, related_name='inventario')
    cantidad_actual = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    # ubicacion = models.CharField(max_length=100, blank=True, null=True)
    almacen = models.ForeignKey(Almacen, on_delete=models.PROTECT, related_name="inventarios")

    fecha_ultima_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventario'
        verbose_name_plural = "Inventarios"

    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad_actual}"
    


    @transaction.atomic
    def mover(self, cantidad, tipo, motivo, proveedor=None, usuario=None):

        if self.ubicacion:
            cache.delete(f"dashboard_resumen_{self.ubicacion}")
        else:
            cache.delete("dashboard_resumen_global")

        if cantidad <= 0:
            raise ValueError("La cantidad debe ser mayor a cero")

        cantidad_anterior = self.cantidad_actual

        if tipo == "ENTRADA":
            delta = cantidad
        elif tipo == "SALIDA":
            if self.cantidad_actual < cantidad:
                raise ValueError("Stock insuficiente")
            delta = -cantidad
        elif tipo == "AJUSTE":
            delta = cantidad - self.cantidad_actual # cantidad = stock final
        else:
            raise ValueError("Tipo de movimiento inválido")

        self.cantidad_actual += delta
        self.save()

        
        if self.producto.stock_bajo():
            alerta, creada = AlertaStock.objects.get_or_create(
                producto=self.producto,
                atendida=False,
                defaults={
                    "stock_actual": self.cantidad_actual,
                    "stock_minimo": self.producto.stock_minimo
                }
            )


            if not creada:
                alerta.stock_actual = self.cantidad_actual
                alerta.save(update_fields=["stock_actual"])


        else:
            AlertaStock.objects.filter(
                producto=self.producto,
                atendida=False
            ).update(atendida=True)



        movimiento = MovimientoInventario.objects.create(
            # inventario=self,
            producto=self.producto,
            tipo_movimiento=tipo,
            cantidad=delta,   # Esto significa: ENTRADA → positivo, SALIDA → negativo No está mal, pero debes ser consistente en frontend y reportes.
            cantidad_anterior=cantidad_anterior,
            cantidad_nueva=self.cantidad_actual,
            motivo=motivo,
            proveedor=proveedor,
            usuario_responsable=usuario
        )

        cache.delete("dashboard_resumen")

        return movimiento
 

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
    observaciones = models.TextField(blank=True, null=True)

    usuario_responsable = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True)

    class Meta:
        db_table = 'movimientos_inventario'
        verbose_name_plural = "Movimientos de Inventario"
        permissions = [
            ("puede_crear_movimiento", "Puede crear movimientos de inventario"),
            ("puede_ver_movimientos", "Puede ver movimientos de inventario"),
        ]

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
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    usuario_creador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

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
        if self.compra.estado == "COMPLETADA":
            raise ValueError("No se puede modificar una compra completada")
        self.subtotal = Decimal(self.cantidad) * self.precio_unitario


        with transaction.atomic():
            super().save(*args, **kwargs)

            total = DetalleCompra.objects.filter(
                compra=self.compra
            ).aggregate(
                total=Sum("subtotal")
            )["total"] or Decimal("0.00")

            Compra.objects.filter(
                id_compra=self.compra.id_compra
            ).update(total=total)

    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad} unidades"
    
    def delete(self, *args, **kwargs):
        if self.compra.estado == "COMPLETADA":
            raise ValueError("No se puede eliminar un detalle de una compra completada")
        return super().delete(*args, **kwargs)

    

class AlertaStockManager(models.Manager):
    def pendientes(self):
        return self.filter(atendida=False)




class AlertaStock(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    stock_actual = models.IntegerField()
    stock_minimo = models.IntegerField()
    fecha = models.DateTimeField(auto_now_add=True)
    atendida = models.BooleanField(default=False)

    objects = AlertaStockManager()

    class Meta:
        db_table = 'alertas_stock'
        constraints = [
            models.UniqueConstraint(
                fields=['producto'],
                condition=models.Q(atendida=False),
                name='unique_alerta_stock_activa'
            )
        ]

    def __str__(self):
        return f"Alerta {self.producto.nombre}"
    