import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgIf, NgFor, CurrencyPipe, NgClass, } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIf,
    NgFor,
    NgClass,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})


export class Productos implements OnInit {

  

  productos: any[] = [];
  productosFiltrados: any[] = [];
  marcas: any[] = [];
  categorias: any[] = [];
  proveedores: any[] = [];
  opcionesUnidad = [
  { value: 'pieza', label: 'Pieza' },
  { value: 'caja', label: 'Caja' },
  { value: 'kg', label: 'Kilogramo' },
  { value: 'lt', label: 'Litro' },
  { value: 'm', label: 'Metro' }
];


  cargando = false;
  searchTerm = '';
  
  mostrarModal = false;
  isSaving = false;
  isDeletingId: number | null = null;

  selectedProduct: any = null;
  selectedImage: File | null = null;

  productoForm!: FormGroup;

  totalPiezas = 0;

  mostrarModalSalida = false;
  productoSalida: any = null;

  salidaCantidad = 1;
  salidaMotivo = 'VENTA';
  salidaComentario = '';

  private productosSub!: Subscription;




  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    
  ) {}

  

  ngOnInit() {

  this.productoService.cargarProductos();
  

  // this.productoService.productos$.subscribe(productos => {
  //   this.productos = productos.map(p => ({
  //     ...p,
  //     cantidad_actual: p.cantidad_actual ?? 0
  //   }));
  //   this.productosFiltrados = [...this.productos];
  // });

    this.productosSub = this.productoService.productos$.subscribe(productos => {
      this.productos = productos.map(p => ({
        ...p,
        cantidad_actual: p.cantidad_actual ?? 0
      }));
      this.productosFiltrados = [...this.productos];
    });


    
    this.cargarMarcas();
    this.crearFormulario();
    this.cargarCategorias();
    this.cargarProveedores();
    
    
  }

  actualizarDatosProducto(id: number, data: any) {
    const index = this.productos.findIndex(p => p.id_producto === id);
    if (index !== -1) {
      this.productos[index] = {
        ...this.productos[index],
        ...data
      };
    }
    
  }

  registrarSalida(producto: any, cantidad: number) {
  if (cantidad <= 0) return;

  
  this.productoService
    .moverStock(producto.id_producto, cantidad, 'SALIDA', 'VENTA')
    .subscribe({
      next: (res) => {
        producto.cantidad_actual = res.movimiento.cantidad_nueva;
        this.productosFiltrados = [...this.productos];
       
      },
      error: (err) => {
        alert(err.error?.error || 'Error al registrar salida');
      }
    });
}
  

  crearFormulario() {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio_compra: ['', Validators.required],
      precio_venta: ['', Validators.required],
      // stock: ['', Validators.required],
      marca: ['', Validators.required],
      imagen: [null],
      cantidad_actual: [0], 
      cantidad_agregar: [0],
      codigo_barras: [''],
      categoria: [''],
      proveedor: [''],
      unidad_medida: ['pieza', Validators.required]
      
    });
  }



  
  
// --------------------------------------------------------------
  cargarMarcas() {
    this.productoService.getMarcas().subscribe({
      next: (data) => (this.marcas = data)
    });
  }

  cargarCategorias() {
    this.productoService.getCategorias().subscribe({
      next: data => this.categorias = data
    });
  }

cargarProveedores() {
    this.productoService.getProveedores().subscribe({
      next: data => this.proveedores = data
    });
}


  filtrarProductos() {
    const term = this.searchTerm.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(term)
    );
  }

  abrirModal(producto: any = null) {
    this.selectedProduct = producto;

    if (producto) {
      this.productoForm.patchValue({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio_compra: producto.precio_compra,
        precio_venta: producto.precio_venta,

        marca: producto.marca ?? null,
        categoria: producto.categoria ?? null,
        proveedor: producto.proveedor ?? null,

        codigo_barras: producto.codigo_barras || '',
        unidad_medida: producto.unidad_medida || 'pieza',
        cantidad_actual: producto.cantidad_actual ?? 0,
        cantidad_agregar: 0
      });
    } else {
      this.productoForm.reset({
      unidad_medida: 'pieza',
      cantidad_actual: 0,
      cantidad_agregar: 0
    });
      this.selectedImage = null;
      
    }

    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.productoForm.reset();
    this.selectedProduct = null;
    this.selectedImage = null;
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0] || null;
  }

guardarProducto() {
  if (this.productoForm.invalid) {
    this.productoForm.markAllAsTouched();
    return;
  }

  this.isSaving = true;
  const data = this.productoForm.value;

  const formData = new FormData();

  // ============================
  // ARMADO CORRECTO DE FORMDATA
  // ============================
  for (const key in data) {
    if (['cantidad_agregar', 'cantidad_actual'].includes(key)) continue;
    if (['marca', 'categoria', 'proveedor'].includes(key)) continue;

    const value = data[key];
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value.toString());
    }
  }

  // Campos relacionales (fuera del for)
  if (data.marca) formData.set('marca', data.marca);
  if (data.categoria) formData.set('categoria', data.categoria);
  if (data.proveedor) formData.set('proveedor', data.proveedor);

  // Imagen seleccionada
  if (this.selectedImage) {
    formData.append('imagen', this.selectedImage);
  }


  if (this.selectedProduct) {
  const id = this.selectedProduct.id_producto;
  const cantidadAgregar = Number(data.cantidad_agregar || 0);

  this.productoService.actualizarProducto(id, formData).subscribe({
    next: () => {

      // 🟢 Actualizar 
      // datos locales


      const { cantidad_agregar, cantidad_actual, ...productoLimpio } = data;
      this.actualizarDatosProducto(id, {
      ...productoLimpio,
      imagen: this.selectedImage
      ? `${this.selectedProduct.imagen?.split('?')[0]}?t=${Date.now()}`
      : this.selectedProduct.imagen
      });


      // 🟢 SOLO mover stock si es válido
      if (!isNaN(cantidadAgregar) && cantidadAgregar > 0) {
        this.productoService
          .moverStock(id, cantidadAgregar, 'ENTRADA', 'AJUSTE')
          .subscribe({
            next: (res) => {
              const index = this.productos.findIndex(p => p.id_producto === id);
              if (index !== -1) {
                this.productos[index].cantidad_actual = res.movimiento.cantidad_nueva;
              }
            },
            error: (err) => {
              console.warn('Stock no aplicado', err.error);
            }
          });
      }

      this.productosFiltrados = [...this.productos];
      this.cerrarModal();
      this.isSaving = false;
    },
    error: () => (this.isSaving = false),
  });

  return;
}    
        
      
  // ==================================
  // CREAR PRODUCTO NUEVO
  // ==================================

  this.productoService.crearProducto(formData).subscribe({
  next: (productoCreado) => {

    // 🔥 NORMALIZAR IMAGEN
    productoCreado.imagen = productoCreado.imagen
      ? `http://localhost:8000${productoCreado.imagen}?t=${Date.now()}`
      : null;

    this.productos.push(productoCreado);
    this.productosFiltrados = [...this.productos];

    // ✅ CERRAR MODAL INMEDIATAMENTE
    this.cerrarModal();
    this.isSaving = false;

    const cantidadAgregar = Number(data.cantidad_agregar);

    // 👉 mover stock SIN bloquear UI
    if (cantidadAgregar > 0) {
      this.productoService
        .moverStock(productoCreado.id_producto, cantidadAgregar, 'ENTRADA', 'AJUSTE')
        .subscribe({
          next: (res) => {
            productoCreado.cantidad_actual = res.movimiento.cantidad_nueva;
          },
          error: (err) => {
            console.warn('Producto creado, pero stock falló', err.error);
          }
        });
    }
  },
  error: () => (this.isSaving = false),
});
}

  confirmEliminar(producto: any) {
    if (!confirm(`¿Eliminar ${producto.nombre}?`)) return;

    this.isDeletingId = producto.id_producto;

    this.productoService.eliminarProducto(producto.id_producto).subscribe({
      next: () => {
        this.isDeletingId = null;
      },
      error: () => (this.isDeletingId = null)
    });
  }

abrirModalSalida(producto: any) {
  this.productoSalida = producto;
  this.salidaCantidad = 1;
  this.salidaMotivo = 'VENTA';
  this.salidaComentario = '';
  this.mostrarModalSalida = true;
}

cerrarModalSalida() {
  this.mostrarModalSalida = false;
  this.productoSalida = null;
}

confirmarSalida() {
  if (!this.productoSalida || this.salidaCantidad <= 0) {
    alert('La cantidad debe ser mayor a 0');
    return;
  }

    
  this.productoService
    .moverStock(
      this.productoSalida.id_producto,
      Number(this.salidaCantidad) || 1,
      'SALIDA',
      this.salidaMotivo
    )
    .subscribe({
      next: (res) => {
        this.productoSalida.cantidad_actual = res.movimiento.cantidad_nueva;
        // this.refrescarVista();
        this.cerrarModalSalida();
      },
      error: (err) => {
        alert(err.error?.error || 'Error al registrar salida');
      }
    });
}



  
}


