
import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../services/categoria';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categoria-list.html'
})
export class CategoriaListComponent implements OnInit {

  categorias: any[] = [];
  loading = true;

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.getAll().subscribe({
      next: data => {
        this.categorias = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // eliminar(id: number) {
  //   if (!confirm('¿Eliminar categoría?')) return;

  //   this.categoriaService.delete(id).subscribe(() => {
  //     this.cargarCategorias();
  //   });
  // }

  // editar(id: number) {
  //   this.router.navigate(['/categorias/editar', id]);
  // }

  eliminar(id: number) {
    if (!confirm('¿Eliminar categoría?')) return;

    this.categoriaService.delete(id).subscribe({
      next: () => {
        alert('Categoría eliminada con éxito');
        this.cargarCategorias();
      },
      error: (err) => {
        console.error(err);
        alert('No se pudo eliminar la categoría');
      }
    });
  }

  editar(id: number) {
    this.router.navigate(['/categorias/editar', id]);
  }
}

