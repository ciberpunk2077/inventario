
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = 'http://localhost:8000/api/proveedores/';

  constructor(private http: HttpClient) {}

  // 📌 Listar proveedores activos
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 📌 Obtener proveedor por ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  // 📌 Crear proveedor (con imagen)
  create(formData: FormData): Observable<any> {
  return this.http.post(this.apiUrl, formData);
}
  // create(data: any): Observable<any> {
  //   const formData = this.buildFormData(data);
  //   return this.http.post(this.apiUrl, formData);
  // }

  // 📌 Actualizar proveedor
  update(id: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}${id}/`, formData);
}
  // update(id: number, data: any): Observable<any> {
  //   const formData = this.buildFormData(data);
  //   return this.http.put(`${this.apiUrl}${id}/`, formData);
  // }


  // 📌 Borrado lógico
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  // 📌 Listar proveedores inactivos (opcional)
  getInactivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}inactivos/`);
  }

  // 🧠 Helper para FormData
  // private buildFormData(data: any): FormData {
  //   const formData = new FormData();

  //   Object.keys(data).forEach(key => {
  //     if (data[key] !== null && data[key] !== undefined) {
  //       formData.append(key, data[key]);
  //     }
  //   });

  //   return formData;
  // }
}

