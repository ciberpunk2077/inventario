import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MovimientosComponent } from './pages/movimientos/movimientos';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'movimientos', component: MovimientosComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];