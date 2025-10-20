import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { ContactType } from '../../../models/contact-type.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ContactTypeService {
    private apiUrl = environment.personBaseURL + 'contactType';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private contactTypesSignal = signal<ContactType[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    contactTypesComputed = computed(() => this.contactTypesSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('ContactType changes: ', this.contactTypesComputed)
    //   });
    // }

    public loadContactType() {
        this.loadingSignal.set(true);
        this.http
            .get<ContactType[]>(this.apiUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.contactTypesSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getContactType(): Observable<ContactType[]> {
        return this.http.get<ContactType[]>(this.apiUrl)
    }

    public addContactType(contactType: ContactType) {
        this.http
            .post<ContactType>(this.apiUrl, contactType)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newContactType) => {
                    this.contactTypesSignal.update((contactTypesComputed) => [...contactTypesComputed, newContactType]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updateContactType(contactType: ContactType) {
        this.http.put<ContactType>(this.apiUrl, contactType).subscribe({
            next: (updatedContactType) => {
                this.contactTypesSignal.update((contactType) => contactType.map((x) => (x.contactTypeID === updatedContactType.contactTypeID ? updatedContactType : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deleteContactType(contactTypeID: number) {
        this.loadingSignal.set(true);
        this.http.delete<ContactType>(`${this.apiUrl}/${contactTypeID}`).subscribe({
            next: () => {
                this.contactTypesSignal.update((contactTypes) => contactTypes.filter((x) => x.contactTypeID !== contactTypeID));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
