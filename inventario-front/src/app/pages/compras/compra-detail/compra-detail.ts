
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../../services/compra';

@Component({
  selector: 'app-compra-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compra-detail.html',
  styleUrl: './compra-detail.css',
})
export class CompraDetailComponent implements OnInit {

  compra: any;
  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private compraService: CompraService
  ) {}

  ngOnInit() {
    this.cargarCompra();
  }

  cargarCompra() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Este método debe existir en tu servicio:
    // getById(id)
    this.compraService.getById(id).subscribe(data => {
      this.compra = data;
    });
  }

  completarCompra() {
    if (!this.compra || this.cargando) return;

    if (!confirm("¿Estás seguro de completar esta compra? Esta acción no se puede deshacer.")) {
      return;
    }

    this.cargando = true;

    this.compraService.completar(this.compra.id_compra)
      .subscribe({
        next: () => {
          alert("Compra completada e inventario actualizado");
          this.cargarCompra();
          this.cargando = false;
        },
        error: () => {
          alert("Error al completar la compra");
          this.cargando = false;
        }
      });
  }
}
