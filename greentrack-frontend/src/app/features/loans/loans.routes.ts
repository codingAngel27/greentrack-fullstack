import { Routes } from "@angular/router";
import { authGuard } from "../../core/auth/auth.guard";
import { LoansListComponent } from "./loans-list/loans-list.component";

export const LOANS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: LoansListComponent,
  },
];