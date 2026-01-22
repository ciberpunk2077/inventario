
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../../services/categoria';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria-form.html'
})
export class CategoriaFormComponent implements OnInit {

  categoria: any = {
    nombre: '',
    descripcion: ''
  };

  editando = false;
  id!: number;
  errorMensaje = '';

  constructor(
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.editando = true;
      this.categoriaService.getById(this.id).subscribe({
        next: data => this.categoria = data,
        error: () => this.errorMensaje = 'Error al cargar la categoría'
      });
    }
  }

  guardar() {
    this.errorMensaje = '';
    const accion = this.editando
      ? this.categoriaService.update(this.id, this.categoria)
      : this.categoriaService.create(this.categoria);

    
    // accion.subscribe({
    //   next: () => {
    //     this.router.navigate(['/categorias']);
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     alert(err.error?.nombre ? err.error.nombre[0] : 'Error al guardar categoría');
    //   }
    // });
    // accion.subscribe({
    //   next: (res) => {
    //     // Mostrar alerta si se revivió
    //     if (!this.editando && res.id_categoria && res.fecha_creacion) {
    //       alert(res.activo ? 'Categoría guardada o reactivada con éxito' : 'Categoría guardada con éxito');
    //     }
    //     this.router.navigate(['/categorias']);
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     alert(err.error?.nombre ? err.error.nombre[0] : 'Error al guardar categoría');
    //   }
    // });
    accion.subscribe({
      next: () => this.router.navigate(['/categorias']),
      error: err => {
        this.errorMensaje =
          err.error?.nombre?.[0] ||
          'Error al guardar la categoría';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/categorias']);
  }
  }
  

