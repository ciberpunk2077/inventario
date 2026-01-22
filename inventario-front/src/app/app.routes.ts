import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MovimientosComponent } from './pages/movimientos/movimientos';
import { authGuard } from './guards/auth-guard';
import { PermissionGuard } from './guards/permission-guard';
import { KardexComponent } from './pages/kardex/kardex';
import { InventarioComponent } from './pages/inventario/inventario';
import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { CategoriaFormComponent } from './pages/categorias/categoria-form/categoria-form';
import { CategoriaListComponent } from './pages/categorias/categoria-list/categoria-list';
import { MarcaFormComponent } from './pages/marcas/marca-form/marca-form';
import { MarcaListComponent } from './pages/marcas/marca-list/marca-list';
import { ProveedorListComponent } from './pages/proveedor/proveedor-list/proveedor-list';
import { ProveedorFormComponent } from './pages/proveedor/proveedor-form/proveedor-form';
import { ProductoListComponent } from './pages/productos/producto-list/producto-list';
import { ProductoFormComponent } from './pages/productos/producto-form/producto-form';
import { StockMoveComponent } from './pages/stock/stock-move/stock-move';
import { ProductoMovimientosComponent } from './pages/productos/producto-movimientos/producto-movimientos';
import { ProductoDetailComponent } from './pages/productos/productos-detail/productos-detail';

export const routes: Routes = [

  // 🔐 LOGIN SIN LAYOUT
  {
    path: 'login',
    component: LoginComponent
  },

  // 🧱 RUTAS CON LAYOUT (SIDEBAR)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard], // 👈 protege TODO el layout
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
      },

      {
        path: 'movimientos',
        component: MovimientosComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: ['view_movimientoinventario']
        }
      }, 

      { path: 'productos', component: ProductoListComponent },
      { path: 'productos/nuevo', component: ProductoFormComponent },
      { path: 'productos/editar/:id', component: ProductoFormComponent },
      { path: 'productos/:id/mover-stock', component: StockMoveComponent },
      { path: 'productos/:id/movimientos', component: ProductoMovimientosComponent },
      { path: 'productos/:id', component: ProductoDetailComponent},
  


      { path: 'proveedores', component: ProveedorListComponent },
      { path: 'proveedores/nueva', component: ProveedorFormComponent },
      { path: 'proveedores/editar/:id', component: ProveedorFormComponent },

      { path: 'marcas', component: MarcaListComponent },
      { path: 'marcas/nueva', component: MarcaFormComponent },
      { path: 'marcas/editar/:id', component: MarcaFormComponent },     
      { path: 'categorias', component: CategoriaListComponent },
      { path: 'categorias/nueva', component: CategoriaFormComponent },
      { path: 'categorias/editar/:id', component: CategoriaFormComponent },

      {
        path: 'inventario',
        component: InventarioComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: ['puede_ver_movimientos']
        }
      },

      {
        path: 'productos/:id/kardex',
        component: KardexComponent
      },

      // ruta por defecto dentro del layout
      {
        path: '',
        redirectTo: 'movimientos',
        pathMatch: 'full'
      }
    ]
  },

  // fallback
  { path: '**', redirectTo: 'login' }
];
