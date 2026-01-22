
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DashboardResumen, ValorInventario } from '../models/dashboard.model';


@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private apiUrl = 'http://localhost:8000/api';

  // 🧠 CACHE FRONTEND
  // private dashboardCache: DashboardResumen | null = null;
  
  constructor(private http: HttpClient) {}

  obtenerResumenDashboard(): Observable<DashboardResumen> {

    // 👇 Si ya existe, no pegues al backend
    // if (this.dashboardCache) {
    //   return of(this.dashboardCache);
    // }

    // 👇 Si no existe, pídelo y guárdalo
    // return this.http.get<DashboardResumen>(
    //   `${this.apiUrl}/dashboard/resumen/`
    //   // `http://localhost:8000/api/dashboard/resumen/`
    // ).pipe(
    //   tap(data => this.dashboardCache = data)
    // )
    return this.http.get<DashboardResumen>(
      `${this.apiUrl}/dashboard/resumen/`
    );
  }

  

  descargarInventarioExcel(): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/reportes/inventario/excel/`,
      {
        responseType: 'blob'
      }
    );
  }

  obtenerGraficaMovimientos() {
    return this.http.get<any>(
      `${this.apiUrl}/dashboard/grafica/`
    );
  }

  getValorInventario(valor: number | ValorInventario): ValorInventario | null {
  if (typeof valor === 'object' && valor !== null) {
    return valor;
  }
  return null;
}


  
}
