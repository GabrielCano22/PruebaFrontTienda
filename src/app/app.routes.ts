import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Auth (sin layout)
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  // App con layout
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'productos',
        loadComponent: () => import('./features/productos/productos.component').then(m => m.ProductosComponent),
      },
      {
        path: 'carrito',
        loadComponent: () => import('./features/carrito/carrito.component').then(m => m.CarritoComponent),
      },
      {
        path: 'mis-compras',
        loadComponent: () => import('./features/facturas/facturas.component').then(m => m.FacturasComponent),
      },
      {
        path: 'facturas/:id',
        loadComponent: () => import('./features/facturas/factura-detalle/factura-detalle.component').then(m => m.FacturaDetalleComponent),
      },
      // Admin only
      {
        path: 'categorias',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/categorias/categorias.component').then(m => m.CategoriasComponent),
      },
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/usuarios/usuarios.component').then(m => m.UsuariosComponent),
      },
      {
        path: 'descuentos',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/descuentos/descuentos.component').then(m => m.DescuentosComponent),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/perfil/perfil.component').then(m => m.PerfilComponent),
      },
    ],
  },

  { path: '**', redirectTo: '/dashboard' },
];
