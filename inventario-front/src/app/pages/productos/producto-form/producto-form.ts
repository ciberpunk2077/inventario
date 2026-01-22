// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-producto-form',
//   imports: [],
//   templateUrl: './producto-form.html',
//   styleUrl: './producto-form.css',
// })
// export class ProductoForm {

// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductoService } from '../../../services/producto';
import { CategoriaService } from '../../../services/categoria';
import { ProveedorService } from '../../../services/proveedor';
import { MarcaService } from '../../../services/marca';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.html',
  styleUrl:'./producto-form.css'
})
export class ProductoFormComponent implements OnInit {

  producto: any = {
    codigo_barras: '',
    nombre: '',
    descripcion: '',
    categoria: null,
    proveedor: null,
    marca: null,
    precio_compra: 0,
    precio_venta: 0,
    stock_minimo: 0,
    stock_maximo: 100,
    unidad_medida: 'pieza',
    imagen: null
  };

  categorias: any[] = [];
  proveedores: any[] = [];
  marcas: any[] = [];

  editando = false;
  id!: number;
  imagenPreview: string | null = null;
  errorMsg = '';

  unidades = [
    { value: 'pieza', label: 'Pieza' },
    { value: 'caja', label: 'Caja' },
    { value: 'kg', label: 'Kilogramo' },
    { value: 'lt', label: 'Litro' },
    { value: 'm', label: 'Metro' },
  ];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private marcaService: MarcaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.cargarCatalogos();

    if (this.id) {
      this.editando = true;
      this.productoService.getById(this.id).subscribe(data => {
        this.producto = data;
        this.imagenPreview = data.imagen_url;
      });
    }
  }

  cargarCatalogos() {
    this.categoriaService.getCategorias().subscribe(data => this.categorias = data);
    this.proveedorService.getAll().subscribe(data => this.proveedores = data);
    this.marcaService.getAll().subscribe(data => this.marcas = data);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.producto.imagen = file;

      const reader = new FileReader();
      reader.onload = () => this.imagenPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  // guardar() {
  //   this.errorMsg = '';

  //   const formData = new FormData();
  //   Object.keys(this.producto).forEach(key => {
  //     if (this.producto[key] !== null && this.producto[key] !== '') {
  //       formData.append(key, this.producto[key]);
  //     }
  //   });

  //   const accion = this.editando
  //     ? this.productoService.updateProducto(this.id, formData)
  //     : this.productoService.createProducto(formData);

  //   accion.subscribe({
  //     next: () => this.router.navigate(['/productos']),
  //     error: err => {
  //       console.error(err);
  //       this.errorMsg = err.error?.nombre
  //         ? err.error.nombre[0]
  //         : 'Error al guardar producto';
  //     }
  //   });
  // }

  guardar() {
    this.errorMsg = '';
    const formData = new FormData();

    // 🔹 CAMPOS EDITABLES
    formData.append('nombre', this.producto.nombre);
    formData.append('codigo_barras', this.producto.codigo_barras || '');
    formData.append('descripcion', this.producto.descripcion || '');
    formData.append('precio_compra', this.producto.precio_compra);
    formData.append('precio_venta', this.producto.precio_venta);
    formData.append('stock_minimo', this.producto.stock_minimo);
    formData.append('stock_maximo', this.producto.stock_maximo);
    formData.append('unidad_medida', this.producto.unidad_medida);
    formData.append('categoria', this.producto.categoria);

    if (this.producto.proveedor) {
      formData.append('proveedor', this.producto.proveedor);
    }

    if (this.producto.marca) {
      formData.append('marca', this.producto.marca);
    }

    // 🔹 IMAGEN SOLO SI ES FILE
    if (this.producto.imagen instanceof File) {
      formData.append('imagen', this.producto.imagen);
    }

    const accion = this.editando
      ? this.productoService.updateProducto(this.id, formData)
      : this.productoService.createProducto(formData);

    accion.subscribe({
      next: () => this.router.navigate(['/productos']),
      error: err => {
        console.error(err);
        this.errorMsg = 'Error al guardar producto';
      }
    });
  }


  cancelar() {
    this.router.navigate(['/productos']);
  }
}

