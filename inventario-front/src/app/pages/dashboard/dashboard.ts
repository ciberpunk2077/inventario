
import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../services/reportes';
import { CommonModule } from '@angular/common';
import { DashboardResumen, ValorInventario } from '../../models/dashboard.model';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit{

  // cards: { titulo: string; valor: string | number }[] = [];
  cards: { titulo: string; valor?: number;  valorInventario?: ValorInventario; }[] = [];
  alertas: DashboardResumen['alertas'] = [];

  loading = true;

  labels: string[] = [];
  entradas: number[] = [];
  salidas: number[] = [];

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Entradas',
        tension: 0.4,
        fill: true
      },
      {
        data: [],
        label: 'Salidas',
        tension: 0.4,
        fill: true
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };


  constructor(private reportes: ReportesService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard() {
    
    this.reportes.obtenerResumenDashboard().subscribe({
      next: (data) => {

        this.cards = [
          { titulo: 'Total productos', valor: data.total_productos },
          { titulo: 'Stock total', valor: data.stock_total },
          // { titulo: 'Valor inventario', valor: `$${data.valor_inventario}` },
          {
            titulo: 'Valor inventario',
            valorInventario: {
              invertido: data.valor_invertido,
              ganado: data.valor_ganado
            }
          },
          { titulo: 'Stock bajo', valor: data.productos_bajo_stock }
        ];

        this.alertas = data.alertas ?? [];
        console.log('DASHBOARD DATA:', data);
        this.loading = false;
      },
      error: () => this.loading = false
    });

    
    this.reportes.obtenerGraficaMovimientos().subscribe({
      next: (grafica) => {
        this.lineChartData = {
          labels: grafica.labels,
          datasets: [
            { ...this.lineChartData.datasets[0], data: grafica.entradas },
            { ...this.lineChartData.datasets[1], data: grafica.salidas }
          ]
        };
      },
      error: (err) => {
        console.error('Error cargando gráfica', err);
      }
    });


  }


  descargarExcel() {
    this.reportes.descargarInventarioExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventario.xlsx';
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar Excel', err);
      }
    });
  }

  irProducto(id: number) {
  this.router.navigate(['/productos', id]);
}

  isValorInventario(
    valor: number | ValorInventario
  ): valor is ValorInventario {
    return typeof valor === 'object' && valor !== null && 'invertido' in valor;
  }

 
}

