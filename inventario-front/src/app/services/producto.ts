
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:8000/api/productos/';

  constructor(private http: HttpClient) {}

  // 📦 Listar productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 🔍 Obtener producto por ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  // getById(id: number) {
  //   return this.http.get<any>(`${this.apiUrl}${id}/`);
  // }

  // ➕ Crear producto (soporta imagen)
  createProducto(data: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // ✏️ Actualizar producto
  updateProducto(id: number, data: FormData): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}${id}/`, data);
  }

  // ❌ Eliminar (soft delete en backend)
  deleteProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }

  

  // 🔁 Mover stock
  moverStock(id: number, payload: {
    cantidad: number;
    tipo: 'ENTRADA' | 'SALIDA';
    proveedor?: number;
    motivo?: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${id}/mover_stock/`,
      payload
    );
  }

  getMovimientos(id: number) {
    return this.http.get<any[]>(
      `${this.apiUrl}${id}/movimientos/`
    );
  }


}

