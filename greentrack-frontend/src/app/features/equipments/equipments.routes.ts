import { Routes } from "@angular/router";
import { EquipmentListComponent } from "./equipments-list/equipments-list.component";
import { authGuard } from "../../core/auth/auth.guard";

export const EQUIPMENTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: EquipmentListComponent,
  },
];