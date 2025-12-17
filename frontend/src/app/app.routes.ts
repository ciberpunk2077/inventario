import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Productos } from './pages/productos/productos';
// import { FormProducto } from './pages/form-producto/form-producto';
import { Marca } from './pages/marca/marca';
import { Provedor } from './pages/provedor/provedor';
import { CategoriasComponent } from './pages/categoria/categoria';
import { HistorialMovimientosComponent } from './pages/historialmovimiento/historialmovimiento';

export const routes: Routes = [
	{ path: '', component: Inicio },
	{ path: 'historial', component: HistorialMovimientosComponent },
	{ path: 'inicio', redirectTo: '', pathMatch: 'full' },
    { path: 'productos', component: Productos },
	{ path: 'producto/:id', loadComponent: () => import('./pages/form-producto/form-producto')
      .then(m => m.FormProducto) },
	{ path: 'marcas', component: Marca },
	{path: 'provedores', component: Provedor},
	{path: 'categorias', component: CategoriasComponent},
];

