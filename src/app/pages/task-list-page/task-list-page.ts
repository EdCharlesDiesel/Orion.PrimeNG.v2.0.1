import { Component } from '@angular/core';
import { TaskListComponent } from '../../features/components/task-list/task-list.component';

@Component({
    selector: 'app-task-list-page',
    standalone: true,
    imports: [ TaskListComponent],
    template: `

      <app-task-list></app-task-list>

    `
})
export class TaskListPagePage {}
