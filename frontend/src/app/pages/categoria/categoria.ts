import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../services/categoria';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  standalone: true,
  templateUrl: './categoria.html',
  styleUrl: './categoria.css',
  imports: [CommonModule, ReactiveFormsModule]
})
export class CategoriasComponent implements OnInit {

  categorias: any[] = [];
  categoriaForm!: FormGroup;
  editando = false;
  categoriaSeleccionada: any = null;

  constructor(
    private categoriaService: CategoriaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      activo: [true]
    });

    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe((data) => {
      this.categorias = data;
    });
  }

  abrirModalCrear() {
    this.editando = false;
    this.categoriaSeleccionada = null;

    this.categoriaForm.reset({
      nombre: '',
      descripcion: '',
      activo: true
    });

    const dialog: any = document.getElementById('modalCategoria');
    dialog.showModal();
  }

  abrirModalEditar(categoria: any) {
    this.editando = true;
    this.categoriaSeleccionada = categoria;

    this.categoriaForm.patchValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      activo: categoria.activo
    });

    const dialog: any = document.getElementById('modalCategoria');
    dialog.showModal();
  }

  cerrarModal() {
    const dialog: any = document.getElementById('modalCategoria');
    dialog.close();
  }

  guardarCategoria() {
    const datos = this.categoriaForm.value;

    if (this.editando && this.categoriaSeleccionada) {
      this.categoriaService.updateCategoria(
          this.categoriaSeleccionada.id_categoria,
          datos
      ).subscribe(() => {
        this.cargarCategorias();
        this.cerrarModal();
      });

    } else {
      this.categoriaService.createCategoria(datos).subscribe(() => {
        this.cargarCategorias();
        this.cerrarModal();
      });
    }
  }

  eliminarCategoria(id: number) {
    if (confirm("¿Seguro que deseas eliminar esta categoría?")) {
      this.categoriaService.deleteCategoria(id).subscribe(() => {
        this.cargarCategorias();
      });
    }
  }
}
