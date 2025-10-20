import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = 'http://localhost:5000/api';

    constructor(private http: HttpClient) {}

    getMessages(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/messages`);
    }

    sendMessage(message: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/messages`, message);
    }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users`);
    }

    uploadAttachment(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`${this.apiUrl}/attachments/upload`, formData, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    const progress = Math.round(100 * event.loaded / (event.total || 1));
                    return { type: 'progress', progress };
                } else if (event.type === HttpEventType.Response) {
                    return event.body;
                }
                return null;
            })
        );
    }

    downloadAttachment(id: number): void {
        window.open(`${this.apiUrl}/attachments/${id}`, '_blank');
    }

    deleteMessage(messageId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/messages/${messageId}`);
    }
}
