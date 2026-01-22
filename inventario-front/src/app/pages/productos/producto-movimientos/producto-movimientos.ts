import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../services/producto';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-producto-movimientos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-movimientos.html',
  styleUrl: './producto-movimientos.css',
})
export class ProductoMovimientosComponent implements OnInit {

  movimientos: any[] = [];
  producto: any = null;
  productoId!: number;

  loading = true;
  errorMsg = '';

  zoomLevel = 1;
  minZoom = 1;
  maxZoom = 3;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.productoId) {
      this.errorMsg = 'Producto inválido';
      return;
    }

    this.cargarProducto();


    this.cargarMovimientos();
  }

  // 🔹 Cargar info del producto
  cargarProducto() {
    this.productoService.getById(this.productoId)
      .subscribe({
        next: data => {
          this.producto = data;
        },
        error: () => {
          this.producto = null;
        }
      });
  }

  // 🔹 Cargar movimientos
  cargarMovimientos() {
    this.loading = true;
    this.errorMsg = '';

    this.productoService.getMovimientos(this.productoId)
      .subscribe({
        next: data => {
          this.movimientos = data;
          this.loading = false;
        },
        error: err => {
          this.errorMsg = err.error?.mensaje || 'No se pudieron cargar los movimientos';
          this.loading = false;
        }
      });
  }

  formatoFecha(fecha: string) {
    return new Date(fecha).toLocaleString('es-MX');
  }

  tipoClase(tipo: string) {
    return tipo === 'ENTRADA'
      ? 'badge bg-success'
      : 'badge bg-danger';
  }

  showImageModal = false;

  openImageModal() {
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
  }

  // Cerrar con tecla ESC
  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeImageModal();
  }

  

  resetZoom() {
    this.zoomLevel = 1;
  }

}
