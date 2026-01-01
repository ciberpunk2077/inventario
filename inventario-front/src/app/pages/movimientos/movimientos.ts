import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockService } from '../../services/stock';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule],
  // template: `<h2>Movimientos works!</h2>`
  templateUrl: './movimientos.html'
})
export class MovimientosComponent implements OnInit {

  movimientos: any[] = [];
  loading = true;

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.stockService.getMovimientos().subscribe({
      next: res => {
        this.movimientos = res;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  crearMovimiento() {
    console.log('BOTÓN FUNCIONA');

    const data = {
      "producto_id": 1,
      "tipo": "ENTRADA",
      "cantidad": 5,
      "motivo": "COMPRA"
    };

    console.log('JSON QUE MANDO:', data);

    this.stockService.crearMovimiento(data).subscribe({
      next: (res) => console.log('RESPUESTA:', res),
      error: (err) => console.error('ERROR:', err)
    });
  }
}
