// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class Kardex {
  
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getKardexProducto(productoId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/productos/${productoId}/kardex/`
    );
  }
}
