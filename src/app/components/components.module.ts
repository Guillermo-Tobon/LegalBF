import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsModule } from 'ng2-charts';
import { DonaComponent } from './dona/dona.component';
import { LinealComponent } from './lineal/lineal.component';
import { LinealAdminComponent } from './lineal-admin/lineal-admin.component';
import { DatepickerInlineComponent } from './datepicker-inline/datepicker-inline.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    DonaComponent,
    LinealComponent,
    LinealAdminComponent,
    DatepickerInlineComponent,
  ],
  exports: [
    DonaComponent,
    LinealComponent,
    LinealAdminComponent,
    DatepickerInlineComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class ComponentsModule { }
