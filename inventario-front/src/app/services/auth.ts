import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';

  private permissionsSubject = new BehaviorSubject<string[]>([]);
  permissions$ = this.permissionsSubject.asObservable();

  isSuperUser = false;

  constructor(private http: HttpClient) {}

  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/token/`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  

  

  loadPermissions() {
    this.http.get<any>(`${this.apiUrl}/usuarios/permisos/`)
      .subscribe(res => {
        this.permissionsSubject.next(res.permissions);
        this.isSuperUser = res.is_superuser;
      });
  }

  hasPermission(permission: string): boolean {
    if (this.isSuperUser) return true;
    return this.permissionsSubject.value.includes(permission);
  }

  hasAnyPermission(perms: string[]): boolean {
    if (this.isSuperUser) return true;
    return perms.some(p => this.permissionsSubject.value.includes(p));
  }


}
