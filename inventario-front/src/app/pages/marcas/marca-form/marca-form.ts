// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-marca-form',
//   imports: [],
//   templateUrl: './marca-form.html',
//   styleUrl: './marca-form.css',
// })
// export class MarcaForm {

// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarcaService } from '../../../services/marca';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-marca-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marca-form.html'
})
export class MarcaFormComponent implements OnInit {

  marca: any = {
    nombre: '',
    logo: null
  };

  editando = false;
  id!: number;
  logoPreview: string | null = null;
  errorMensaje = '';

  constructor(
    private marcaService: MarcaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.editando = true;
      this.marcaService.getById(this.id).subscribe({
        next: data => {
          this.marca.nombre = data.nombre;
          this.logoPreview = data.logo_url;
        },
        error: () => this.errorMensaje = 'Error al cargar la marca'
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.marca.logo = file;

      const reader = new FileReader();
      reader.onload = () => this.logoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    this.errorMensaje = '';

    const formData = new FormData();
    formData.append('nombre', this.marca.nombre);

    if (this.marca.logo) {
      formData.append('logo', this.marca.logo);
    }

    const accion = this.editando
      ? this.marcaService.update(this.id, formData)
      : this.marcaService.create(formData);

    accion.subscribe({
      next: () => this.router.navigate(['/marcas']),
      error: err => {
        this.errorMensaje =
          err.error?.nombre?.[0] || 'Error al guardar la marca';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/marcas']);
  }
}
