import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { ConfiguracionCuentaComponent } from './configuracion-cuenta/configuracion-cuenta.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PerfilComponent,
    CuentaComponent,
    PagesComponent,
    ConfiguracionCuentaComponent,
  ],
  exports: [
    DashboardComponent,
    PerfilComponent,
    CuentaComponent,
    PagesComponent,
    ConfiguracionCuentaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ComponentsModule
  ]
})
export class PagesModule { }
