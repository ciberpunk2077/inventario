
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('access');

    // console.log('🔥 INTERCEPTOR EJECUTADO22222222222');
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 🟢 2️⃣ Manejo global de errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        // 🔴 Token inválido o expirado
        if (error.status === 401) {
          this.auth.logout();          // limpia localStorage
          this.router.navigate(['/login']);
        }

        // 🔴 Sin permisos
        if (error.status === 403) {
          console.warn('Acceso denegado');
        }

        return throwError(() => error);
      })
    );
  }
}
