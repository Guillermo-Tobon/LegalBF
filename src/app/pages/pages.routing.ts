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
import { TerminosComponent } from './terminos/terminos.component';
import { CrearInversionComponent } from './crear-inversion/crear-inversion.component';
import { CrearAnexoComponent } from './crear-anexo/crear-anexo.component';
import { DetalleInversionComponent } from './detalle-inversion/detalle-inversion.component';
import { DetalleAnexoComponent } from './detalle-anexo/detalle-anexo.component';


const routes: Routes = [
  { 
    path: 'dashboard', 
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
      { path: 'perfil', component: PerfilComponent, data: {titulo: 'Profile'} },
      { path: 'balances', component: BalancesComponent, data: {titulo: 'Balance'} },
      { path: 'inversiones', component: InversionesComponent, data: {titulo: 'Project'} },
      { path: 'documentacion', component: DocumentacionComponent, data: {titulo: 'Documentation'} },
      { path: 'configuracion-cuenta', component: ConfiguracionCuentaComponent, data: {titulo: 'Account settings'} },
      { path: 'crear-cliente', component: CrearClienteComponent, data: {titulo: 'Create client'} },
      { path: 'crear-inversion/:usuario', component: CrearInversionComponent, data: {titulo: 'Create project'} },
      { path: 'crear-anexo/:inversion', component: CrearAnexoComponent, data: {titulo: 'Create annex'} },
      { path: 'lista-clientes', component: ListaClientesComponent, data: {titulo: 'Client list'} },
      { path: 'detalle-cliente/:usuario', component: DetalleClienteComponent, data: {titulo: 'Detail client'} },
      { path: 'detalle-anexo/:anexo', component: DetalleAnexoComponent, data: {titulo: 'Detail annex'} },
      { path: 'detalle-inversion/:inversion', component: DetalleInversionComponent, data: {titulo: 'Detail project'} },
      { path: 'tickets/:usuario', component: TicketsComponent, data: {titulo: 'Tickets'} },
      { path: 'lista-tickets', component: ListaTicketsComponent, data: {titulo: 'Tickets list'} },
      { path: 'quienes-somos', component: QuienesSomosComponent, data: {titulo: 'About'} },
      { path: 'terminos', component: TerminosComponent, data: {titulo: 'Terms and Conditions'} }
    ]
  },
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
