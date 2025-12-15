import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  imagen: string;
  imagen_url: string;
  cantidad_actual: number;
  categoria_nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getProductos(search?: string, categoria?: number): Observable<Producto[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (categoria) params = params.set('categoria', categoria.toString());
    
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/`, { params });
  }
}
