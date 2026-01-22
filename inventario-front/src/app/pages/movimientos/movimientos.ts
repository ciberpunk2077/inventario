import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockService } from '../../services/stock';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes';


@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  // template: `<h2>Movimientos works!</h2>`
  templateUrl: './movimientos.html'
})
export class MovimientosComponent implements OnInit {

  movimientos: any[] = [];
  filtroTipo = '';
  loading = true;

  constructor(private stockService: StockService,
    private reportes: ReportesService
  ) {}

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  descargarExcel() {
  this.reportes.descargarInventarioExcel().subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventario.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Error al descargar Excel', err);
    }
  });
}


  cargarMovimientos() {
    this.loading = true;
    this.stockService.getMovimientos({ tipo: this.filtroTipo })
      .subscribe({
        next: data => {
          this.movimientos = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }


  // ngOnInit() {
  //   this.stockService.getMovimientos().subscribe({
  //     next: res => {
  //       this.movimientos = res;
  //       this.loading = false;
  //     },
  //     error: err => {
  //       console.error(err);
  //       this.loading = false;
  //     }
  //   });
  // }
  // crearMovimiento() {
  //   console.log('BOTÓN FUNCIONA');

  //   const data = {
  //     "producto_id": 1,
  //     "tipo": "ENTRADA",
  //     "cantidad": 5,
  //     "motivo": "COMPRA"
  //   };

  //   console.log('JSON QUE MANDO:', data);

  //   this.stockService.crearMovimiento(data).subscribe({
  //     next: (res) => console.log('RESPUESTA:', res),
  //     error: (err) => console.error('ERROR:', err)
  //   });
  // }

  claseTipo(tipo: string) {
    return {
      'text-success fw-bold': tipo === 'ENTRADA',
      'text-danger fw-bold': tipo === 'SALIDA',
      'text-primary fw-bold': tipo === 'AJUSTE'
    };
  }

  trackById(_: number, item: any) {
  return item.id;
}


}
