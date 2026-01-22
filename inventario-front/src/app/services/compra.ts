// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class Compra {



//   completar(id: number) {
//   return this.http.post(
//     `${this.API_URL}/compras/${id}/completar/`,
//     {}
//   );
// }
  
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompraService {

  private API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener compra por ID
  getById(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/compras/${id}/`);
  }

  completar(id: number): Observable<any> {
    return this.http.post(
      `${this.API_URL}/compras/${id}/completar/`,
      {}
    );
  }
}
