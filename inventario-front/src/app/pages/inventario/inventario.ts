// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-inventario',
//   imports: [],
//   templateUrl: './inventario.html',
//   styleUrl: './inventario.css',
// })
// export class Inventario {

// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../services/inventario';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inventario.html'
})
export class InventarioComponent implements OnInit {

  inventarios: any[] = [];
  loading = true;

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.inventarioService.getInventario().subscribe({
      next: data => {
        this.inventarios = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  stockBajo(item: any): boolean {
    return item.cantidad_actual <= item.producto.stock_minimo;
  }
}
