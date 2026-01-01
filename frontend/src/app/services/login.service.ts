import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private apiUrl = 'http://localhost:8000/api/token/';

  constructor(private http: HttpClient) {}

  
  login(credenciales: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, credenciales);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
