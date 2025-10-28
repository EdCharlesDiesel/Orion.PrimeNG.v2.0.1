import { Component } from '@angular/core';
import { ImageUploadComponent } from '../../features/components/files/image-upload/image-upload.component';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import {
    ImageUploadAdvancedComponent
} from '../../features/components/files/image-upload-advanced/image-upload-advanced.component';
import { TaskListComponent } from '../../features/components/task-list/task-list.component';
import { WishListComponent } from '../../features/components/wish-list/wish-list.component';

@Component({
    selector: 'app-wish-list-page',
    standalone: true,
    imports: [WishListComponent],
    template: ` <app-wish-list></app-wish-list> `
})
export class WishListPage {}
