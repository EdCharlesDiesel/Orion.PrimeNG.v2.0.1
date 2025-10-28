import { Component } from '@angular/core';
import { ImageUploadComponent } from '../../features/components/files/image-upload/image-upload.component';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import {
    ImageUploadAdvancedComponent
} from '../../features/components/files/image-upload-advanced/image-upload-advanced.component';
import { TaskListComponent } from '../../features/components/task-list/task-list.component';
import { ReportsComponent } from '../../features/components/reports/reports.component';

@Component({
    selector: 'app-reports-page',
    standalone: true,
    imports: [ReportsComponent],
    template: ` <app-reports></app-reports> `
})
export class ReportsPage {}
