import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {TaskListModule} from "./task-list/task-list.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TaskListModule
  ],
  declarations: []
})
export class FeaturesModule {
}
