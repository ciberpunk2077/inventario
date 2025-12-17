import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovimientoBackend } from '../core/models/movimiento-backend.model';



@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private baseUrl = 'http://localhost:8000/api/movimientos';

  constructor(private http: HttpClient) {}

  obtenerMovimientos(
    tipo?: 'ENTRADA' | 'SALIDA',
    searchTerm?: string,
    startDate?: string,
    endDate?: string
  ): Observable<MovimientoBackend[]> {
    let params = new HttpParams();
    if (tipo) params = params.set('tipo', tipo);
    if (searchTerm) params = params.set('search', searchTerm);
    if (startDate) params = params.set('start', startDate);
    if (endDate) params = params.set('end', endDate);

    return this.http.get<MovimientoBackend[]>(this.baseUrl, { params });
  }
}
