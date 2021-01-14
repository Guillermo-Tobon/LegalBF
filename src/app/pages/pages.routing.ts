import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { InversionesComponent } from './inversiones/inversiones.component';
import { ConfiguracionCuentaComponent } from './configuracion-cuenta/configuracion-cuenta.component';
import { CrearClienteComponent } from './crear-cliente/crear-cliente.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { DetalleClienteComponent } from './detalle-cliente/detalle-cliente.component';
import { BalancesComponent } from './balances/balances.component';
import { TicketsComponent } from './tickets/tickets.component';
import { DocumentacionComponent } from './documentacion/documentacion.component';
import { ListaTicketsComponent } from './lista-tickets/lista-tickets.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';


const routes: Routes = [
  { 
    path: 'dashboard', 
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'balances', component: BalancesComponent },
      { path: 'inversiones', component: InversionesComponent },
      { path: 'documentacion', component: DocumentacionComponent },
      { path: 'configuracion-cuenta', component: ConfiguracionCuentaComponent },
      { path: 'crear-cliente', component: CrearClienteComponent },
      { path: 'lista-clientes', component: ListaClientesComponent },
      { path: 'detalle-cliente/:usuario', component: DetalleClienteComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'lista-tickets', component: ListaTicketsComponent },
      { path: 'quienes-somos', component: QuienesSomosComponent }
    ]
  },
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
