// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductoService {
//   private apiUrl = 'http://127.0.0.1:8000/api/productos/'; // tu API Django

//   constructor(private http: HttpClient) { }

//   cargarProductos(): void {
//     this.http.get<any[]>(this.apiUrl).subscribe({
//       next: data => this.productosSubject.next(data),
//       error: err => console.error('Error cargando productos', err)
//     });
//   }



//   getProductos(): Observable<any> {
//     return this.http.get(this.apiUrl);
//   }

//   getProducto(id: number): Observable<any> {
//     return this.http.get(`${this.apiUrl}${id}/`);
//   }

//   crearProducto(producto: any): Observable<any> {
//     return this.http.post(this.apiUrl, producto);
//   }

//   actualizarProducto(id: number, producto: any): Observable<any> {
//     return this.http.put(`${this.apiUrl}${id}/`, producto);
//   }

//   eliminarProducto(id: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}${id}/`);
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://127.0.0.1:8000/api/productos/';

  private productosSubject = new BehaviorSubject<any[]>([]);
  productos$ = this.productosSubject.asObservable();

  constructor(private http: HttpClient) {}

  cargarProductos(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => this.productosSubject.next(data),
      error: err => console.error('Error cargando productos', err)
    });
  }

  getProductos(): Observable<any[]> {
    return this.productos$;
  }

  getProducto(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  crearProducto(producto: any): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }

  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
