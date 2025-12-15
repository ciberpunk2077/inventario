import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-marca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marca.html',
  styleUrl: './marca.css',
})
export class Marca implements OnInit {

  marcas: any[] = [];

  mostrarForm = false;
  vistaPreviaLogo: string | null = null;

  modalVisible = false;
  modo: 'crear' | 'editar' = 'crear';

  marcaForm: any = {
    nombre: '',
    activo: true,
    logo: null
  };

  archivoLogo: File | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarMarcas();
  }

  cargarMarcas() {
    this.http
      .get('http://localhost:8000/api/marcas/')
      .subscribe((data: any) => (this.marcas = data));
  }

  registrarMarca() {
    const formData = new FormData();
    formData.append('nombre', this.marcaForm.nombre);
    formData.append('activo', this.marcaForm.activo ? 'true' : 'false');

    if (this.archivoLogo) {
      formData.append('logo', this.archivoLogo);
    }

    this.http.post('http://localhost:8000/api/marcas/', formData).subscribe({
      next: (data: any) => {
        this.marcas.push(data);
        this.mostrarForm = false;
        this.vistaPreviaLogo = null;

        this.marcaForm = { nombre: '', logo: null, activo: true };
      },
      error: (err) => console.error('Error al registrar marca', err),
    });
    
  }

  eliminarMarca(marca: any) {
  if (!confirm(`¿Seguro que deseas eliminar la marca "${marca.nombre}"?`)) {
    return;
  }

  this.http.delete(`http://localhost:8000/api/marcas/${marca.id_marca}/`).subscribe({
    next: () => {
      // Quitar de la tabla sin recargar todo
      this.marcas = this.marcas.filter(m => m.id_marca !== marca.id_marca);
      alert("Marca eliminada correctamente");
    },
    error: (err) => {
      console.error("ERROR al eliminar:", err);
      alert("No se pudo eliminar la marca");
    }
  });
}


  convertirImagen(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    this.archivoLogo = archivo;

    const reader = new FileReader();
    reader.onload = () => {
      this.vistaPreviaLogo = reader.result as string;
    };
    reader.readAsDataURL(archivo);
  }

  abrirModalEditar(marca: any) {
    this.modo = 'editar';
    this.modalVisible = true;

    this.marcaForm = { ...marca };
    this.vistaPreviaLogo = marca.logo || null;
  }

  abrirModalCrear() {
    this.modo = 'crear';
    this.modalVisible = true;

    this.marcaForm = {
      nombre: '',
      activo: true,
      logo: null,
    };

    this.archivoLogo = null;
    this.vistaPreviaLogo = null;
  }

  guardarMarca() {
  const formData = new FormData();
  formData.append('nombre', this.marcaForm.nombre);
  formData.append('activo', String(this.marcaForm.activo));

  if (this.archivoLogo) {
    formData.append('logo', this.archivoLogo);
  }

  if (this.modo === 'crear') {
    this.http.post('http://localhost:8000/api/marcas/', formData).subscribe({
      next: () => {
        this.cargarMarcas();
        this.modalVisible = false;
      },
      error: (err: any) => {
        console.log("🔥 ERROR DJANGO:", err.error);
      }
    });
  } else {
    this.http.put(`http://localhost:8000/api/marcas/${this.marcaForm.id_marca}/`, formData).subscribe({
      next: () => {
        this.cargarMarcas();
        this.modalVisible = false;
      },
      error: (err: any) => {
        console.log("🔥 ERROR Django completo:", err.error.nombre);
      }
    });
  }
}




  // ✅ SOLO UNA VEZ
  cerrarModal() {
    this.modalVisible = false;
  }

}
