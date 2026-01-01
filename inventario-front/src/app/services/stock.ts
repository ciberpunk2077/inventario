import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = 'http://localhost:8000/api';
  

  constructor(private http: HttpClient) {}

  getMovimientos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/movimientos/`);
  }

  crearMovimiento(data: any): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/movimientos/`, data);
    
  }

  
  
}
