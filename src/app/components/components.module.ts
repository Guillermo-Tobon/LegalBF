import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsModule } from 'ng2-charts';
import { DonaComponent } from './dona/dona.component';





@NgModule({
  declarations: [
    DonaComponent,
  ],
  exports: [
    DonaComponent
  ],
  imports: [
    CommonModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
