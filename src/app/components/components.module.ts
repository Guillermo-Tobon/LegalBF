import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsModule } from 'ng2-charts';
import { DonaComponent } from './dona/dona.component';
import { LinealComponent } from './lineal/lineal.component';
import { LinealAdminComponent } from './lineal-admin/lineal-admin.component';





@NgModule({
  declarations: [
    DonaComponent,
    LinealComponent,
    LinealAdminComponent,
  ],
  exports: [
    DonaComponent,
    LinealComponent,
    LinealAdminComponent,
  ],
  imports: [
    CommonModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
