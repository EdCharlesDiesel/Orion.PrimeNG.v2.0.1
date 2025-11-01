import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import * as ImageUploadActions from '../../../../store/image-upload/image-upload.actions';
import * as ImageUploadSelectors from '../../../../store/image-upload/image-upload.selectors';
import { Toast } from 'primeng/toast';
import { FileUpload } from 'primeng/fileupload';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { ButtonDirective } from 'primeng/button';

@Component({
    selector: 'app-image-upload-advanced',
    templateUrl: './image-upload-advanced.component.html',
    imports: [Toast, FileUpload, NgIf, AsyncPipe, NgForOf, ButtonDirective, NgOptimizedImage],
    providers: [MessageService]
})
export class ImageUploadAdvancedComponent implements OnInit {
    uploadedFiles$: Observable<any[]>;
    images$: Observable<any[]>;
    loading$: Observable<boolean>;

    constructor(
        private store: Store,
        private messageService: MessageService
    ) {
        this.uploadedFiles$ = this.store.select(ImageUploadSelectors.selectUploadedFiles);
        this.images$ = this.store.select(ImageUploadSelectors.selectAllImages);
        this.loading$ = this.store.select(ImageUploadSelectors.selectLoading);
    }

    ngOnInit() {
        this.store.dispatch(ImageUploadActions.loadImages());
    }

    onUpload(event: any) {
        const files: File[] = event.files || [event.currentFiles[0]];

        if (files.length === 1) {
            this.store.dispatch(ImageUploadActions.uploadImage({ file: files[0] }));
        } else {
            this.store.dispatch(ImageUploadActions.uploadMultipleImages({ files }));
        }

        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File(s) uploaded successfully'
        });
    }

    onSelect(event: any) {
        const files: File[] = event.currentFiles;
        console.log('Files selected:', files);
    }

    deleteImage(id: number) {
        this.store.dispatch(ImageUploadActions.deleteImage({ id }));
        this.messageService.add({
            severity: 'info',
            summary: 'Deleted',
            detail: 'Image deleted successfully'
        });
    }
}
