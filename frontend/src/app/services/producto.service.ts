import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from './producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:8000/api/productos/';
  private baseApi = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getValorInventario() {
  return this.http.get<{ valor_inventario: number }>(
    'http://localhost:8000/api/inventario/valor/'
  );
}



//   actualizarStock(id: number, cantidad: number, tipo: string): Observable<any> {
//   return this.http.put(`${this.apiUrl}${id}/actualizar-stock/`, {
//     cantidad,
//     tipo
//   });
// }

  // CRUD basico usado por el componente
   getProducto(id: number) {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  crearProducto(producto: FormData): Observable<any> {
  return this.http.post(this.apiUrl, producto);
}


  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, producto);
  }
  

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  // Marcas
  getMarcas(): Observable<any> {
    return this.http.get(`${this.baseApi}/marcas/`);
  }

  crearMarca(payload: any): Observable<any> {
    // payload can be FormData for logo upload
    return this.http.post(`${this.baseApi}/marcas/`, payload);
  }

  getCategorias(): Observable<any> {
    return this.http.get(`${this.baseApi}/categorias/`);
}

  getProveedores(): Observable<any> {
    return this.http.get(`${this.baseApi}/proveedores/`);
  }

  moverStock(id: number, cantidad: number, tipo: string, motivo: string = 'AJUSTE', proveedor?: number, usuario: string = 'Administrador'): Observable<any> {
  const payload: any = { cantidad, tipo, motivo, usuario };
  if (proveedor) payload.proveedor = proveedor;
  return this.http.post(`${this.apiUrl}${id}/mover_stock/`, payload);
}



}
