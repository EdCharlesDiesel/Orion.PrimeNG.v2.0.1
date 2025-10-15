import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {TaskListModule} from "./task-list/task-list.module";
import FeaturesRoutingModule from './features-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    FormsModule,
    TaskListModule
  ],
  declarations: []
})
export class FeaturesModule {
}
