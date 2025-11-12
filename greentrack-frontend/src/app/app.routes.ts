import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { MAIN_ROUTES } from './features/main/main.routes';

/**
 * Rutas principales de la aplicación.
 */
export const routes: Routes = [
    {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: AUTH_ROUTES,
  },
  { path: 'panel',
    children: MAIN_ROUTES },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
  
];
