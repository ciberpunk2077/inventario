// // producto.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Producto } from './producto';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductoService {

//   private baseApi = 'http://localhost:8000/api';
//   private productosUrl = `${this.baseApi}/productos`;

//   constructor(private http: HttpClient) { }

//   // Método para construir headers con token
//   private getAuthHeaders(): { headers: HttpHeaders } {
//     const token = localStorage.getItem('token');
//     return {
//       headers: new HttpHeaders({
//         'Authorization': token ? `Bearer ${token}` : '',
//       })
//     };
//   }

//   // Obtener todos los productos
//   obtenerProductos(): Observable<Producto[]> {
//     return this.http.get<Producto[]>(this.productosUrl , this.getAuthHeaders());
//   }

//   // Obtener un producto por id
//   getProducto(id: number): Observable<Producto> {
//     return this.http.get<Producto>(`${this.productosUrl}/${id}/`, this.getAuthHeaders());
//   }

//   // Crear un producto (FormData si incluye imagen)
//   crearProducto(producto: FormData): Observable<any> {
//     return this.http.post(`${this.productosUrl}/`, producto, this.getAuthHeaders());
//   }

//   // Actualizar un producto
//   actualizarProducto(id: number, producto: any): Observable<any> {
//     return this.http.put(`${this.productosUrl}/${id}/`, producto, this.getAuthHeaders());
//   }

//   // Eliminar un producto
//   eliminarProducto(id: number): Observable<any> {
//     return this.http.delete(`${this.productosUrl}/${id}/`, this.getAuthHeaders());
//   }

//   // Movimiento de stock (salida, entrada, ajuste)
//   moverStock(id: number, cantidad: number, tipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE', motivo: string = 'AJUSTE', proveedor?: number, usuario: string = 'Administrador'): Observable<any> {
//     const payload: any = { cantidad, tipo, motivo, usuario };
//     if (proveedor) payload.proveedor = proveedor;
//     return this.http.post(`${this.productosUrl}/${id}/mover_stock/`, payload, this.getAuthHeaders());
//   }

//   // Obtener marcas
//   getMarcas(): Observable<any> {
//     return this.http.get(`${this.baseApi}/marcas/`, this.getAuthHeaders());
//   }

//   crearMarca(payload: any): Observable<any> {
//     return this.http.post(`${this.baseApi}/marcas/`, payload, this.getAuthHeaders());
//   }

//   // Obtener categorías
//   getCategorias(): Observable<any> {
//     return this.http.get(`${this.baseApi}/categorias/`, this.getAuthHeaders());
//   }

//   // Obtener proveedores
//   getProveedores(): Observable<any> {
//     return this.http.get(`${this.baseApi}/proveedores/`, this.getAuthHeaders());
//   }

//   // Obtener valor total del inventario
//   getValorInventario(): Observable<{ valor_inventario: number }> {
//     return this.http.get<{ valor_inventario: number }>(`${this.baseApi}/inventario/valor/`, this.getAuthHeaders());
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  private apiUrl = 'http://127.0.0.1:8000/api/productos/';

  private productosSubject = new BehaviorSubject<any[]>([]);
  productos$ = this.productosSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔥 Carga inicial
  cargarProductos(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => this.productosSubject.next(data),
      error: err => console.error(err)
    });
  }

  // 🔁 CRUD
  crearProducto(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      tap(() => this.cargarProductos())
    );
  }

  actualizarProducto(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, data).pipe(
      tap(() => this.cargarProductos())
    );
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`).pipe(
      tap(() => this.cargarProductos())
    );
  }

  moverStock(id: number, cantidad: number, tipo: string, motivo: string) {
    return this.http.post<any>(`${this.apiUrl}${id}/mover-stock/`, {
      cantidad,
      tipo,
      motivo
    });
  }
  

    // Obtener marcas
  getMarcas(): Observable<any> {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/marcas/');
  }

  getProducto(id: number) {
  return this.http.get<any>(`${this.apiUrl}${id}/`);
}


  // crearMarca(payload: any): Observable<any> {
  //   return this.http.post(`${this.baseApi}/marcas/`, payload, this.getAuthHeaders());
  // }

  // Obtener categorías
  getCategorias(): Observable<any> {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/categorias/');
  }

  // Obtener proveedores
  getProveedores(): Observable<any> {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/proveedores/');
  }

  // Obtener valor total del inventario
  // getValorInventario(): Observable<{ valor_inventario: number }> {
  //   return this.http.get<{ valor_inventario: number }>(`${this.baseApi}/inventario/valor/`, this.getAuthHeaders());
  // }


  

}
  

