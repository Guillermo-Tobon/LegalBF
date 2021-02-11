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


const routes: Routes = [
  { 
    path: 'dashboard', 
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
      { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil'} },
      { path: 'balances', component: BalancesComponent, data: {titulo: 'Balances'} },
      { path: 'inversiones', component: InversionesComponent, data: {titulo: 'Inversiones'} },
      { path: 'documentacion', component: DocumentacionComponent, data: {titulo: 'Documentación'} },
      { path: 'configuracion-cuenta', component: ConfiguracionCuentaComponent, data: {titulo: 'Configuración cuenta'} },
      { path: 'crear-cliente', component: CrearClienteComponent, data: {titulo: 'Crear cliente'} },
      { path: 'crear-inversion/:usuario', component: CrearInversionComponent, data: {titulo: 'Crear inversión'} },
      { path: 'crear-anexo/:inversion', component: CrearAnexoComponent, data: {titulo: 'Crear anexo'} },
      { path: 'lista-clientes', component: ListaClientesComponent, data: {titulo: 'Lista clientes'} },
      { path: 'detalle-cliente/:usuario', component: DetalleClienteComponent, data: {titulo: 'Detalle cliente'} },
      { path: 'detalle-inversion/:inversion', component: DetalleInversionComponent, data: {titulo: 'Detalle inversión'} },
      { path: 'tickets/:usuario', component: TicketsComponent, data: {titulo: 'Tickets'} },
      { path: 'lista-tickets', component: ListaTicketsComponent, data: {titulo: 'Lista de tickets'} },
      { path: 'quienes-somos', component: QuienesSomosComponent, data: {titulo: 'Quiénes somos'} },
      { path: 'terminos', component: TerminosComponent, data: {titulo: 'Términos y condiciones'} }
    ]
  },
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
