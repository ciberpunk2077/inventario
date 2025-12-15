import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './form-producto.html',
  styleUrl: './form-producto.css',
})
export class FormProducto implements OnInit {

  producto: any;
  id: number | null = null;

  form!: FormGroup;
  modoDetalle = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.modoDetalle = true;

      this.productoService.getProducto(this.id).subscribe((data: any) => {
        this.producto = data;
      });

    } else {
      this.modoDetalle = false;

      this.form = this.fb.group({
        nombre: ['', Validators.required],
        precio: ['', Validators.required],
        descripcion: [''],
      });
    }
  }
}
