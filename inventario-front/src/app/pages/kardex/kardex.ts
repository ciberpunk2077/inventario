// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-kardex',
//   imports: [],
//   templateUrl: './kardex.html',
//   styleUrl: './kardex.css',
// })
// export class Kardex {

// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KardexService } from '../../services/kardex';

@Component({
  selector: 'app-kardex',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kardex.html'
})
export class KardexComponent implements OnInit {

  movimientos: any[] = [];
  productoId!: number;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private kardexService: KardexService
  ) {}

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarKardex();
  }

  cargarKardex() {
    this.loading = true;
    this.kardexService.getKardexProducto(this.productoId).subscribe({
      next: (data: any) => {
        this.movimientos = data.kardex;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  claseTipo(tipo: string) {
    return {
      'text-success fw-bold': tipo === 'ENTRADA',
      'text-danger fw-bold': tipo === 'SALIDA',
      'text-primary fw-bold': tipo === 'AJUSTE'
    };
  }
}

