import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ImageUploadService {
    private apiUrl = 'http://localhost:3000/api/images';

    constructor(private http: HttpClient) {}

    uploadImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/upload`, formData);
    }

    uploadMultipleImages(files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        return this.http.post(`${this.apiUrl}/upload-multiple`, formData);
    }

    getImages(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getImage(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    deleteImage(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
