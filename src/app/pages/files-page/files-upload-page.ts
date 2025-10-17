import { Component } from '@angular/core';
import { ImageUploadComponent } from '../../features/components/files/image-upload/image-upload.component';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import {
    ImageUploadAdvancedComponent
} from '../../features/components/files/image-upload-advanced/image-upload-advanced.component';

@Component({
    selector: 'app-files-page',
    standalone: true,
    imports: [ImageUploadComponent, Card, Divider, ImageUploadAdvancedComponent],
    template: `
        <p-card>
            <app-image-upload-advanced></app-image-upload-advanced>
            <p-divider></p-divider>
            <app-image-upload></app-image-upload>
        </p-card>
    `
})
export class FilesPage {}
