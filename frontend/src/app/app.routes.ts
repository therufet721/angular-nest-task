import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/items',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [guestGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
        canActivate: [guestGuard]
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'items',
    loadComponent: () => import('./items/items.component').then(m => m.ItemsComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/items'
  }
];
