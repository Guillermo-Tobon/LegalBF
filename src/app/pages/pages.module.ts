import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { ConfiguracionCuentaComponent } from './configuracion-cuenta/configuracion-cuenta.component';
import { CrearClienteComponent } from './crear-cliente/crear-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { DetalleClienteComponent } from './detalle-cliente/detalle-cliente.component';
import { InversionesComponent } from './inversiones/inversiones.component';
import { BalancesComponent } from './balances/balances.component';
import { TicketsComponent } from './tickets/tickets.component';
import { DocumentacionComponent } from './documentacion/documentacion.component';
import { ListaTicketsComponent } from './lista-tickets/lista-tickets.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { TerminosComponent } from './terminos/terminos.component';
import { CrearInversionComponent } from './crear-inversion/crear-inversion.component';
import { DetalleInversionComponent } from './detalle-inversion/detalle-inversion.component';
import { DetalleAnexoComponent } from './detalle-anexo/detalle-anexo.component';
import { CalendarModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CrearAnexoComponent } from './crear-anexo/crear-anexo.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PerfilComponent,
    PagesComponent,
    ConfiguracionCuentaComponent,
    CrearClienteComponent,
    ListaClientesComponent,
    DetalleClienteComponent,
    InversionesComponent,
    BalancesComponent,
    TicketsComponent,
    DocumentacionComponent,
    ListaTicketsComponent,
    QuienesSomosComponent,
    TerminosComponent,
    CrearInversionComponent,
    DetalleInversionComponent,
    DetalleAnexoComponent,
    CrearAnexoComponent,
  ],
  exports: [
    DashboardComponent,
    PerfilComponent,
    PagesComponent,
    ConfiguracionCuentaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    CalendarModule,
    DatePickerModule,
  ]
})
export class PagesModule { }
