import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class DashboardService {

//   private isBrowser: boolean;

//   constructor(
//     private http: HttpClient,
//     @Inject(PLATFORM_ID) platformId: Object
//   ) {
//     this.isBrowser = isPlatformBrowser(platformId);
//   }

//   obtenerResumen() {

//     if (!this.isBrowser) {
//       return this.http.get<any>(''); // o EMPTY observable
//     }

//     const token = localStorage.getItem('token');

//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`
//     });

//     return this.http.get(
//       'http://localhost:8000/api/dashboard/resumen/',
//       { headers }
//     );
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  obtenerResumen() {
    return this.http.get<any>(
      'http://127.0.0.1:8000/api/dashboard/resumen/'
    );
  }
}


