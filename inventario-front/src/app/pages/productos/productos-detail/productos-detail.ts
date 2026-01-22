import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../../services/producto';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-productos-detail',
  imports: [CommonModule,  RouterModule],
  templateUrl: './productos-detail.html',
  styleUrl: './productos-detail.css',
})
export class ProductoDetailComponent implements OnInit {

  producto: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router
  ) {}



  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productoService.getById(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando producto', err);
        this.loading = false;
      }
    });
  }

  editarProducto(id: number) {
    
    this.router.navigate(['/productos/editar', id]);
  }

  
  getMarginAmount(): number {
    if (!this.producto) return 0;
    return this.producto.precio_venta - this.producto.precio_compra;
  }

  getMarginPercent(): number {
    if (!this.producto || this.producto.precio_compra === 0) return 0;
    return (this.getMarginAmount() / this.producto.precio_compra) * 100;
  }

  getMarginClass(): string {
    const percent = this.getMarginPercent();

    if (percent < 10) return 'margin-low';     // 🔴 bajo
    if (percent < 25) return 'margin-medium'; // 🟡 medio
    return 'margin-high';                      // 🟢 alto
  }


  getMarginBarWidth(): number {
    const percent = this.getMarginPercent();

    if (percent <= 0) return 5;     // mínimo visible
    if (percent >= 50) return 100; // tope visual

    return percent * 2; // escala visual (50% = 100%)
  }




}
