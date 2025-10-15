import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UrlFactoryService } from './url-factory.service';
import { AttachmentModel } from '../core/models/rich-message.model';

@Injectable({
    providedIn: 'root'
})
export class AttachmentService {
    constructor(
        private http: HttpClient,
        private urlFactory: UrlFactoryService
    ) {}

    /**
     * Uploads a FormData object (supports progress reporting).
     */
    uploadFormData(formData: FormData): Observable<HttpEvent<Record<string, string>>> {
        return this.http.post<Record<string, string>>(
            this.urlFactory.getUploadUrl(),
            formData,
            {
                reportProgress: true,
                observe: 'events'
            }
        );
    }

    /**
     * Downloads an attachment and automatically triggers a browser download.
     */
    downloadAttachment(attachment: AttachmentModel): Observable<HttpResponse<Blob>> {
        const payload = new HttpParams().set('fileId', attachment.fileId);

        return this.http.post<Blob>(
            this.urlFactory.getDownloadUrl(),
            payload,
            {
                observe: 'response',
                responseType: 'blob' as 'json' // ✅ TypeScript fix for mixed generic usage
            }
        ).pipe(
            tap((response) => this.redirectBlobToBrowser(response, attachment.name, attachment.type))
        );
    }

    /**
     * Converts a Blob response to a downloadable file in the browser.
     */
    private redirectBlobToBrowser(response: HttpResponse<Blob>, fileName: string, fileType: string): void {
        const blob = new Blob([response.body!], { type: fileType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
}
