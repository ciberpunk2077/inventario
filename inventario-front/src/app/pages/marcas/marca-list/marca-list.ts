// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-marca-list',
//   imports: [],
//   templateUrl: './marca-list.html',
//   styleUrl: './marca-list.css',
// })
// export class MarcaList {

// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarcaService } from '../../../services/marca';

@Component({
  selector: 'app-marca-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './marca-list.html'
})
export class MarcaListComponent implements OnInit {

  marcas: any[] = [];
  cargando = false;

  constructor(private marcaService: MarcaService) {}

  ngOnInit(): void {
    this.cargarMarcas();
  }

  cargarMarcas() {
    this.cargando = true;
    this.marcaService.getAll().subscribe({
      next: data => {
        this.marcas = data;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta marca?')) return;

    this.marcaService.delete(id).subscribe(() => {
      this.cargarMarcas();
    });
  }
}

