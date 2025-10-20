import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {ReportsComponent} from './reports.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    NgOptimizedImage
  ],
  declarations: [ReportsComponent]
})
export class ReportsModule {
}
