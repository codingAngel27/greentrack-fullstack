import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { EQUIPMENTS_ROUTES } from '../equipments/equipments.routes';
import { authGuard } from '../../core/auth/auth.guard';
import { LOANS_ROUTES } from '../loans/loans.routes';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      { path: 'equipments', children: EQUIPMENTS_ROUTES },
      { path: 'loans', children: LOANS_ROUTES },
      { path: '', redirectTo: 'equipments', pathMatch: 'full' },

    ],
  },
];