import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { PhoneNumberType } from '../../../models/phone-number-type.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class PhoneNumberTypeService {
    private apiUrl = environment.personBaseURL+ 'businessEntity';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private businessEntitysSignal = signal<PhoneNumberType[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    businessEntitysComputed = computed(() => this.businessEntitysSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('PersonNumberType changes: ', this.businessEntitysComputed)
    //   });
    // }

    public loadPersonNumberType() {
        this.loadingSignal.set(true);
        this.http
            .get<PhoneNumberType[]>(this.apiUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.businessEntitysSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getPersonNumberTypes(): Observable<PhoneNumberType[]> {
        return this.http.get<PhoneNumberType[]>(this.apiUrl)
    }

    public addPersonNumberType(businessEntity: PhoneNumberType) {
        this.http
            .post<PhoneNumberType>(this.apiUrl, businessEntity)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newPersonNumberType) => {
                    this.businessEntitysSignal.update((businessEntitysComputed) => [...businessEntitysComputed, newPersonNumberType]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updatePersonNumberType(businessEntity: PhoneNumberType) {
        this.http.put<PhoneNumberType>(this.apiUrl, businessEntity).subscribe({
            next: (updatedPersonNumberType) => {
                this.businessEntitysSignal.update((businessEntity) => businessEntity.map((x) => (x.phoneNumberTypeID === updatedPersonNumberType.phoneNumberTypeID ? updatedPersonNumberType : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deletePersonNumberType(phoneNumberTypeID: number) {
        this.loadingSignal.set(true);
        this.http.delete<PhoneNumberType>(`${this.apiUrl}/${phoneNumberTypeID}`).subscribe({
            next: () => {
                this.businessEntitysSignal.update((businessEntitys) => businessEntitys.filter((x) => x.phoneNumberTypeID !== phoneNumberTypeID));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
