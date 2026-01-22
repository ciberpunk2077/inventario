import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../models/producto.model';

export enum ViewMode {
  TABLE = 'table',
  CARDS = 'cards'
}


@Component({
  selector: 'app-producto-list',
  imports: [CommonModule, CurrencyPipe,  RouterModule, FormsModule],
  templateUrl: './producto-list.html',
  styleUrls: ['./producto-list.css']
})
export class ProductoListComponent implements OnInit {

  // productos: any[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  loading = false;
  
  viewMode: ViewMode = ViewMode.TABLE;
  ViewMode = ViewMode; // disponible en HTML

  openMenuId: number | null = null;

  searchText = '';

  categorias: string[] = [];
  selectedCategory: string = '';


  constructor(private productoService: ProductoService,private router: Router) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  trackById(index: number, item: Producto) {
    return item.id_producto;
  }

  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeMenu() {
    this.openMenuId = null;
  }

  toggleView() {
  this.viewMode =
    this.viewMode === ViewMode.TABLE
      ? ViewMode.CARDS
      : ViewMode.TABLE;
}


  // cargarProductos() {
  //   this.loading = true;
  //   this.productoService.getProductos().subscribe({
  //     next: (data: Producto[]) => {
  //       this.productos = data;
  //       this.filtrarProductos();
  //       this.loading = false;
  //     },
  //     error: () => this.loading = false
  //   });
  // }

  cargarProductos() {
    this.loading = true;
    this.productoService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;

        // Extrae categorías únicas
        this.categorias = [
          ...new Set(
            data
              .map(p => p.categoria_nombre)
              .filter((c): c is string => !!c && c.trim() !== '')
          )
        ];

        this.filtrarProductos();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }


  stockBajo(p: Producto): boolean {
    return p.cantidad_actual <= p.stock_minimo;
  }

  verProducto(id: number) {
    this.router.navigate(['/productos', id]);
  }

  editarProducto(id: number) {
    this.router.navigate(['/productos/editar', id]);
  }

  eliminarProducto(id: number) {
    if (!confirm('¿Eliminar este producto?')) return;

    this.productoService.deleteProducto(id).subscribe({
      next: () => this.cargarProductos(),
      error: err => console.error(err)
    });
  }

  // filtrarProductos() {
  //   const text = this.searchText.toLowerCase();

  //   this.productosFiltrados = this.productos.filter(p =>
  //     p.nombre?.toLowerCase().includes(text) ||
  //     p.categoria_nombre?.toLowerCase().includes(text) ||
  //     p.marca_nombre?.toLowerCase().includes(text)
  //   );
  // }

  filtrarProductos() {
    const text = this.searchText.toLowerCase();

    this.productosFiltrados = this.productos.filter(p => {
      const matchText =
        p.nombre?.toLowerCase().includes(text) ||
        p.categoria_nombre?.toLowerCase().includes(text) ||
        p.marca_nombre?.toLowerCase().includes(text);

      const matchCategory =
        !this.selectedCategory ||
        p.categoria_nombre === this.selectedCategory;

      return matchText && matchCategory;
    });
  }


}
