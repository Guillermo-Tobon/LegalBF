import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsModule } from 'ng2-charts';
import { DonaComponent } from './dona/dona.component';
import { LinealComponent } from './lineal/lineal.component';





@NgModule({
  declarations: [
    DonaComponent,
    LinealComponent,
  ],
  exports: [
    DonaComponent,
    LinealComponent
  ],
  imports: [
    CommonModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
