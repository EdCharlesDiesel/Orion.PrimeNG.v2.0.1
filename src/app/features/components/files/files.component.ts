import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { FileUpload } from 'primeng/fileupload';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-access',
    templateUrl: './files.component.html',
    imports: [Toast, FileUpload, Button, CommonModule]
})
export class FilesComponent {
    uploadedFiles: any[] = [];

    constructor(private messageService: MessageService) {}

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    onBasicUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    }
}
