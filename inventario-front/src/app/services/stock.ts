import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = 'http://localhost:8000/api';
  

  constructor(private http: HttpClient) {}

 
  getMovimientos(filters?: {
    tipo?: string;
    producto?: string;
    desde?: string;
    hasta?: string;
  }): Observable<any[]> {
    let params = new HttpParams();
    if (filters?.tipo) params = params.set('tipo', filters.tipo);
    if (filters?.producto) params = params.set('producto', filters.producto);
    if (filters?.desde) params = params.set('desde', filters.desde);
    if (filters?.hasta) params = params.set('hasta', filters.hasta);

    return this.http.get<any[]>(`${this.apiUrl}/movimientos/`, { params });
  }
  
  // CREAR MOVIMIENTO (ENTRADA / SALIDA)
  crearMovimiento(data: {
    producto_id: number;
    tipo: 'ENTRADA' | 'SALIDA';
    cantidad: number;
    motivo?: string;
    proveedor_id?: number | null;
  }) {
    return this.http.post(`${this.apiUrl}/movimientos/`, data);
  }

  
  
}
