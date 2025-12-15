import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  id_proveedor?: number;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  imagen?: File | null;
  imagen_url?: string | null;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = 'http://localhost:8000/api/proveedores/';

  constructor(private http: HttpClient) {}

  crearProveedor(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  actualizarProveedor(id: number, data: FormData) {
    return this.http.put<any>(`${this.apiUrl}${id}/`, data);
  }

  deleteProveedor(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
