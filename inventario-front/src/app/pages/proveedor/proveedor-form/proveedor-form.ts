
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../../services/proveedor';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedor-form.html'
})
export class ProveedorFormComponent implements OnInit {

  proveedor: any = {
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    imagen: null
  };

  editando = false;
  id!: number;
  imagenPreview: string | null = null;
  errorMsg = '';

  constructor(
    private proveedorService: ProveedorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.editando = true;
      this.proveedorService.getById(this.id).subscribe(data => {
        this.proveedor = data;
        this.imagenPreview = data.imagen_url || null;
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.proveedor.imagen = file;

      const reader = new FileReader();
      reader.onload = () => this.imagenPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  
  guardar() {
  this.errorMsg = '';

  const formData = new FormData();

  // 👇 CAMPOS OBLIGATORIOS
  formData.append('nombre', this.proveedor.nombre);

  // 👇 CAMPOS OPCIONALES
  if (this.proveedor.contacto) {
    formData.append('contacto', this.proveedor.contacto);
  }

  if (this.proveedor.telefono) {
    formData.append('telefono', this.proveedor.telefono);
  }

  if (this.proveedor.email) {
    formData.append('email', this.proveedor.email);
  }

  if (this.proveedor.direccion) {
    formData.append('direccion', this.proveedor.direccion);
  }

  if (this.proveedor.imagen instanceof File) {
    formData.append('imagen', this.proveedor.imagen);
  }

  const accion = this.editando
    ? this.proveedorService.update(this.id, formData)
    : this.proveedorService.create(formData);

  accion.subscribe({
    next: () => this.router.navigate(['/proveedores']),
    error: err => {
      console.error(err);
      this.errorMsg = err.error?.nombre
        ? err.error.nombre[0]
        : 'Error al guardar proveedor';
    }
  });
}


  cancelar() {
    this.router.navigate(['/proveedores']);
  }
}
