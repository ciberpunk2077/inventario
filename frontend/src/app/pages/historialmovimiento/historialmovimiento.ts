import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgFor, NgIf, CurrencyPipe, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MovimientoService, MovimientoStock } from '../../services/movimientoservice';
import * as XLSX from 'xlsx';
import { MovimientoMapper } from '../../core/models/mappers/movimiento.mapper';

import { MovimientoService } from '../../services/movimientoservice';
import { MovimientoStock } from '../../core/models/movimiento-stock.model';


@Component({
  selector: 'app-historial-movimientos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgFor, NgIf,
    FormsModule,
    CurrencyPipe,
    ReactiveFormsModule,
      ],
  templateUrl: './historialmovimiento.html',
  styleUrls: ['./historialmovimiento.css']
})
export class HistorialMovimientosComponent implements OnInit {

  movimientos: MovimientoStock[] = [];
  movimientosFiltrados: MovimientoStock[] = [];
  cargando = false;
  searchTerm = '';
  tipo: 'ENTRADA' | 'SALIDA' = 'ENTRADA';

  // filtros por fecha
  startDate: string = '';
  endDate: string = '';

  totalEntradas = 0;
  totalSalidas = 0;
  valorInventario = 0;

  filtroPrincipal: 'marca' | 'tipo' | 'motivo' | '' = '';
  filtroValor: string = '';
  opcionesFiltro: string[] = [];


  constructor(private movimientoService: MovimientoService) {}
  

  ngOnInit() {
    this.cargarMovimientos();
  }

  actualizarOpciones() {
    this.filtroValor = '';
    const valores = new Set<string>();

    switch (this.filtroPrincipal) {
      case 'marca':
        this.movimientos.forEach(m => valores.add(m.productoMarca));
        break;

      case 'tipo':
        this.movimientos.forEach(m => valores.add(m.tipo));
        break;

      case 'motivo':
        this.movimientos.forEach(m => valores.add(m.motivo));
        break;
    }

    this.opcionesFiltro = Array.from(valores);
  }

  aplicarFiltro() {
    if (!this.filtroPrincipal || !this.filtroValor) {
      this.movimientosFiltrados = [...this.movimientos];
      return;
    }

    this.movimientosFiltrados = this.movimientos.filter(m => {
      switch (this.filtroPrincipal) {
        case 'marca':
          return m.productoMarca === this.filtroValor;

        case 'tipo':
          return m.tipo === this.filtroValor;

        case 'motivo':
          return m.motivo === this.filtroValor;

        default:
          return true;
      }
    });
  }



  actualizarDashboard() {
    this.totalEntradas = this.movimientos.filter(m => m.tipo === 'ENTRADA').length;
    this.totalSalidas = this.movimientos.filter(m => m.tipo === 'SALIDA').length;

    // Si quieres calcular valor inventario aproximado
    this.valorInventario = this.movimientos
      .filter(m => m.tipo === 'ENTRADA')
      .reduce((total, m) => total + m.cantidad, 0) 
      - this.movimientos
        .filter(m => m.tipo === 'SALIDA')
        .reduce((total, m) => total + m.cantidad, 0);
  }

  


  cargarMovimientos() {
    this.cargando = true;
    this.movimientoService.obtenerMovimientos(this.tipo, this.searchTerm, this.startDate, this.endDate)
      .subscribe({
        next: data => {
          
          // 1️⃣ Mapear datos del backend
          this.movimientos = MovimientoMapper.fromBackendList(data);
          // 2️⃣ Resetear tabla filtrada
          this.movimientosFiltrados = [...this.movimientos];


          // 3️⃣ 🔥 RESET DE FILTROS AVANZADOS 
          this.filtroPrincipal = '';
          this.filtroValor = '';
          this.opcionesFiltro = [];

          // 4️⃣ Actualizar dashboard
          this.actualizarDashboard();
          this.cargando = false;
        },
        error: () => this.cargando = false
      });
  }

  filtrarMovimientos() {
    const term = this.searchTerm.toLowerCase();
    this.movimientosFiltrados = this.movimientos.filter(m =>
      m.productoNombre.toLowerCase().includes(term) ||
      m.productoMarca.toLowerCase().includes(term) ||
      m.usuarioNombre.toLowerCase().includes(term)
    );
  }

  cambiarTipo(tipo: 'ENTRADA' | 'SALIDA') {
    this.tipo = tipo;
    this.cargarMovimientos();
  }

  exportarExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.movimientosFiltrados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, this.tipo);
    XLSX.writeFile(workbook, `historial_${this.tipo}_${Date.now()}.xlsx`);
  }
}
