

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../services/producto';
import { StockService } from '../../../services/stock';

@Component({
  selector: 'app-stock-move',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-move.html',
  styleUrl: './stock-move.css'
})
export class StockMoveComponent implements OnInit {

  producto: any;
  guardando = false;

  form: {
    tipo: 'ENTRADA' | 'SALIDA';
    cantidad: number;
    proveedor: number | null;
    motivo: string;
  } = {
    tipo: 'ENTRADA',
    cantidad: 1,
    proveedor: null,
    motivo: 'AJUSTE'
  };

  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private stockService: StockService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.getById(id).subscribe(p => {
      this.producto = p;
    });
  }

  guardar() {
    if (!this.producto || this.guardando) return;

    if (this.form.cantidad <= 0) {
      this.errorMsg = 'La cantidad debe ser mayor a 0';
      return;
    }

    this.guardando = true;  
    const payload = {
      producto_id: this.producto.id_producto,
      tipo: this.form.tipo,
      cantidad: this.form.cantidad,
      motivo: this.form.motivo,
      proveedor_id: this.form.proveedor
    };


    this.stockService.crearMovimiento(payload).subscribe({
      next: () => this.router.navigate(['/productos']),
      error: err => {
        // console.error(err);
        console.log('ERROR BACKEND:', err.error);
        this.errorMsg = err.error?.mensaje || 'Error al mover stock';
        this.guardando = false;
      }
    });
  }

  get stockResultante() {
    if (!this.producto) return 0;

    return this.form.tipo === 'ENTRADA'
      ? this.producto.cantidad_actual + this.form.cantidad
      : this.producto.cantidad_actual - this.form.cantidad;

    // return Math.max(result, 0);
  }



  cancelar() {
    this.router.navigate(['/productos']);
  }
}
