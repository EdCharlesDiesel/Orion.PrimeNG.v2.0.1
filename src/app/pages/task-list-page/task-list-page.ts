import { Component } from '@angular/core';
import { ImageUploadComponent } from '../../features/components/files/image-upload/image-upload.component';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import {
    ImageUploadAdvancedComponent
} from '../../features/components/files/image-upload-advanced/image-upload-advanced.component';
import { TaskListComponent } from '../../features/components/task-list/task-list.component';

@Component({
    selector: 'app-task-list-page',
    standalone: true,
    imports: [Card, TaskListComponent],
    template: `
        <p-card>
      <app-task-list></app-task-list>
        </p-card>
    `
})
export class TaskListPagePage {}
