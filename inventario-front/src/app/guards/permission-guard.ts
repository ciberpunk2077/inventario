
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const requiredPerms = route.data['permissions'] as string[];

    if (this.auth.hasAnyPermission(requiredPerms)) {
      return true;
    }

    this.router.navigate(['/no-autorizado']);
    return false;
  }
}

