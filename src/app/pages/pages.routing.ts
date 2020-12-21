import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CuentaComponent } from './cuenta/cuenta.component';


const routes: Routes = [
  { 
    path: 'dashboard', 
    component: PagesComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'cuenta', component: CuentaComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
