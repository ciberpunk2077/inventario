// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-proveedor-list',
//   imports: [],
//   templateUrl: './proveedor-list.html',
//   styleUrl: './proveedor-list.css',
// })
// export class ProveedorList {

// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProveedorService } from '../../../services/proveedor';

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proveedor-list.html'
})
export class ProveedorListComponent implements OnInit {

  proveedores: any[] = [];
  loading = true;

  constructor(
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.loading = true;
    this.proveedorService.getAll().subscribe({
      next: data => {
        this.proveedores = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  nuevo() {
    this.router.navigate(['/proveedores/nuevo']);
  }

  editar(id: number) {
    this.router.navigate(['/proveedores/editar', id]);
  }

  eliminar(id: number) {
    if (!confirm('¿Deseas desactivar este proveedor?')) return;

    this.proveedorService.delete(id).subscribe(() => {
      this.cargarProveedores();
    });
  }
}

