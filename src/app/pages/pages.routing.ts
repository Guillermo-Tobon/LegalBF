import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { ConfiguracionCuentaComponent } from './configuracion-cuenta/configuracion-cuenta.component';
import { CrearClienteComponent } from './crear-cliente/crear-cliente.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { DetalleClienteComponent } from './detalle-cliente/detalle-cliente.component';


const routes: Routes = [
  { 
    path: 'dashboard', 
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'cuenta', component: CuentaComponent },
      { path: 'configuracion-cuenta', component: ConfiguracionCuentaComponent },
      { path: 'crear-cliente', component: CrearClienteComponent },
      { path: 'lista-clientes', component: ListaClientesComponent },
      { path: 'detalle-cliente/:usuario', component: DetalleClienteComponent }
    ]
  },
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
