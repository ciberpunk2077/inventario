import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { ProductoService } from '../../services/producto.service';
import { ProveedorService } from '../../services/provedor';

@Component({
  selector: 'app-provedor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './provedor.html',
  styleUrl: './provedor.css',
})
export class Provedor implements OnInit {
  
  proveedorForm!: FormGroup;
  vistaPrevia: string | ArrayBuffer | null = null;
  proveedores: any[] = [];

  mostrarForm = false;

  proveedorEditando: any = null;  
  esEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.proveedorForm = this.fb.group({
      nombre: [''],
      contacto: [''],
      telefono: [''],
      email: [''],
      direccion: [''],
      imagen: [null],
    });

    this.cargarProveedores();

    
  }

  cargarProveedores() {
    this.proveedorService.obtenerProveedores().subscribe(data => {
      // console.log("Datos recibidos:", data);
      this.proveedores = data;
    });
  }

  // Leer imagen
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.proveedorForm.patchValue({ imagen: file });
      this.proveedorForm.get('imagen')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => this.vistaPrevia = reader.result;
      reader.readAsDataURL(file);
    }
  }

 
  guardarProveedor() {
  const formData = new FormData();
  formData.append('nombre', this.proveedorForm.get('nombre')?.value);
  formData.append('contacto', this.proveedorForm.get('contacto')?.value);
  formData.append('telefono', this.proveedorForm.get('telefono')?.value);
  formData.append('email', this.proveedorForm.get('email')?.value);
  formData.append('direccion', this.proveedorForm.get('direccion')?.value);
  
  const imagen = this.proveedorForm.get('imagen')?.value;
  if (imagen instanceof File) {
    formData.append('imagen', imagen);
  }

  // 🟢 === CREAR ===
  if (!this.esEdicion) {
    this.proveedorService.crearProveedor(formData).subscribe({
      next: () => {
        alert('Proveedor registrado correctamente');
        this.cargarProveedores();
        this.cerrarModal();
      },
      error: err => console.error(err)
    });
  }

  // 🟡 === EDITAR ===
  else {
    this.proveedorService.actualizarProveedor(this.proveedorEditando.id_proveedor, formData)
      .subscribe({
        next: () => {
          alert("Proveedor actualizado correctamente");
          this.cargarProveedores();
          this.cerrarModal();
        },
        error: err => console.error(err)
      });
  }

  }

 confirmDelete(proveedor: any) {
  if (confirm(`¿Eliminar al proveedor "${proveedor.nombre}"?`)) {
    this.deleteProveedor(proveedor.id_proveedor);
  }
}

deleteProveedor(id: number) {
  this.proveedorService.deleteProveedor(id).subscribe({
    next: () => {
      this.proveedores = this.proveedores.filter(p => p.id_proveedor !== id);
    },
    error: (err) => {
      console.error(err);
      alert("Error al eliminar el proveedor");
    }
  });
}


  mostrarModal = false;

abrirModal(proveedor: any = null) {
  this.mostrarModal = true;

  if (proveedor) {
    this.esEdicion = true;
    this.proveedorEditando = proveedor;

    this.proveedorForm.patchValue({
      nombre: proveedor.nombre,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      email: proveedor.email,
      direccion: proveedor.direccion,
      
    });

    this.vistaPrevia = proveedor.imagen ? proveedor.imagen : null;
  } else {
    this.esEdicion = false;
    this.proveedorEditando = null;
    this.proveedorForm.reset();
    this.vistaPrevia = null;
  }
}

cerrarModal() {
  this.mostrarModal = false;
  this.esEdicion = false;
  this.proveedorEditando = null;
  this.proveedorForm.reset();
  this.vistaPrevia = null;
}


}
