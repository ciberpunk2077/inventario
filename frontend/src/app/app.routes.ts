import { Routes } from '@angular/router';
import { Productos } from './pages/productos/productos';
import { Marca } from './pages/marca/marca';
import { Provedor } from './pages/provedor/provedor';
import { CategoriasComponent } from './pages/categoria/categoria';
import { MovimientoInventarioComponent } from './pages/historialmovimiento/historialmovimiento';
import { AuthGuard } from './guards/auth-guard';


import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout';
import { DashboardHomeComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login/login').then(m => m.LoginComponent) },

  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'productos', component: Productos },
      { path: 'marcas', component: Marca },
      { path: 'proveedores', component: Provedor },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'historial', component: MovimientoInventarioComponent },
    ]
  },

  { path: '**', redirectTo: 'login' }
];
