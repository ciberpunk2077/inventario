// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';
  private tokenKey = 'access_token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(`http://localhost:8000/api/token/`,
       { username, password })
      .pipe(tap(res => {
        localStorage.setItem(this.tokenKey, res.access);
      }));
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
