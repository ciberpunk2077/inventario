import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgIf, NgFor, CurrencyPipe, NgClass, } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';


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


  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {}

  totalProductos = 0;
  // valorInventario = 0;
  valorInventario: number = 0;
  


  ngOnInit() {
    this.cargarProductos();
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
    this.productosFiltrados = [...this.productos];
  }


  calcularTotalPiezas() {
  this.totalPiezas = this.productos.reduce(
    (total, p) => total + Number(p.cantidad_actual || 0),
    0
  );
}


  
  
  calcularValorInventario() {
  this.valorInventario = this.productos.reduce(
    (total, p) => total + (Number(p.cantidad_actual) * Number(p.precio_compra)),
    0
  );
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

 

  cargarProductos() {
    this.cargando = true;
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        
        this.productos = data;
        this.productosFiltrados = data;

        this.totalProductos = data.length;
        this.refrescarVista();

       
     
        this.cargando = false;
      },
      error: () => (this.cargando = false)
    });
  }
  

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
    if (key === 'cantidad_agregar' || key === 'cantidad_actual') continue;

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

  // ==================================
  // EDITAR PRODUCTO EXISTENTE
  // ==================================
  if (this.selectedProduct) {
    const id = this.selectedProduct.id_producto;

    this.productoService.actualizarProducto(id, formData).subscribe({
      next: () => {
        const cantidadAgregar = Number(data.cantidad_agregar  || 0);

        if (cantidadAgregar > 0) {
          this.productoService
            .moverStock(id, cantidadAgregar, 'ENTRADA', 'AJUSTE')
            .subscribe({
              next: (res) => {
                const index = this.productos.findIndex(p => p.id_producto === id);
                if (index !== -1) {
                  this.productos[index].cantidad_actual = res.cantidad_nueva;
                }
                this.productosFiltrados = [...this.productos];

                this.refrescarVista();


                this.cerrarModal();
                this.isSaving = false;
              },
              error: () => (this.isSaving = false),
            });
        } else {
          // Solo editar datos, sin stock
          this.actualizarDatosProducto(id, data);

          const index = this.productos.findIndex(p => p.id_producto === id);
          if (index !== -1) {
            this.productos[index] = {
              ...this.productos[index],
              ...data,
              imagen: this.selectedImage
                ? `http://localhost:8000/media/productos/${id}/${this.selectedImage.name}?t=${Date.now()}`
                : (
                    this.productos[index].imagen?.startsWith('http')
                      ? `${this.productos[index].imagen}?t=${Date.now()}`
                      : `http://localhost:8000${this.productos[index].imagen}?t=${Date.now()}`
                  )
            };
          }

          // 🔥 Refrescar lista filtrada
          this.productosFiltrados = [...this.productos];
          this.refrescarVista();




          this.cerrarModal();
          this.isSaving = false;
        }
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
      console.log('RESPUESTA BACKEND:', productoCreado);
      const cantidadAgregar = Number(data.cantidad_agregar);

      if (cantidadAgregar > 0) {
        this.productoService
          .moverStock(productoCreado.id_producto, cantidadAgregar, 'ENTRADA', 'AJUSTE')
          .subscribe({
            next: (res) => {
              productoCreado.cantidad_actual = res.cantidad_nueva;
              // productoCreado.imagen = productoCreado.imagen 
              //   ? `http://localhost:8000${productoCreado.imagen}?t=${Date.now()}`
              //   : null;

              this.productos.push(productoCreado);

              // 🔥 Refrescar filtrados
              this.productosFiltrados = [...this.productos];
              this.refrescarVista();

              this.cerrarModal();
              this.isSaving = false;
            },
            error: () => (this.isSaving = false),
          });
      } else {

        // 🔥 NORMALIZAR IMAGEN (ESTO FALTABA)
      productoCreado.imagen = productoCreado.imagen
        ? `http://localhost:8000${productoCreado.imagen}?t=${Date.now()}`
        : null;

        this.productos.push(productoCreado);

        // 🔥 Refrescar filtrados
        this.productosFiltrados = [...this.productos];
        this.refrescarVista();


        this.cerrarModal();
        this.isSaving = false;
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
        this.cargarProductos();
        this.isDeletingId = null;
      },
      error: () => (this.isDeletingId = null)
    });
  }

  refrescarVista() {
  this.productosFiltrados = [...this.productos];
  this.calcularTotalPiezas();
  this.calcularValorInventario();
  this.totalProductos = this.productos.length;
}


  
}
