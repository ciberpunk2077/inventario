import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProductoService } from '../../services/producto.service'; 
import { Sidebar } from '../../sidebar/sidebar';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule,RouterOutlet],
//   templateUrl: './dashboard-layout.html',
//   styleUrl: './dashboard-layout.css',
//   })
// export class DashboardComponent implements OnInit {
//   data: DashboardResumen | null = null;

//   constructor(private dashboardService: DashboardService, private router: Router) {}

//   ngOnInit(): void {
//     this.dashboardService.obtenerResumen().subscribe({
     
//       next: res => {this.data = res;},
//       error: err => {
//         if (err.status === 401) {
//           console.error('No autorizado: redirigir a login');
//           this.router.navigate(['/login']);
//         } else {
//           console.error('Error al obtener datos:', err);
//         }
//       }
//     });

//     // this.productoService.cargarProductos();
//   }
// }

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayoutComponent implements OnInit {

  constructor(
    private dashboardService: DashboardService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.obtenerResumen().subscribe({
      error: err => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });

    // 🔥 CARGA GLOBAL (NO SE PIERDE)
    this.productoService.cargarProductos();
  }
}
