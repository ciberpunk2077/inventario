import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardResumen } from '../../core/models/dashboard-resumen.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardHomeComponent implements OnInit {

  data: DashboardResumen | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    
    this.dashboardService.obtenerResumen().subscribe({
      next: (res) => {
        console.log('RESUMEN BACKEND:', res);
        this.data = res;
      },
      error: (err) => {
        console.error('Error cargando dashboard', err);
      }
    });
  }
}
