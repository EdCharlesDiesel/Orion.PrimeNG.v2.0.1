import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { BusinessEntityAddress } from '../../../models/business-entity-address.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class BusinessEntityAddressService {
    private apiUrl = environment.personBaseURL+ 'businessEntity';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private businessEntitysSignal = signal<BusinessEntityAddress[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    businessEntitysComputed = computed(() => this.businessEntitysSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('BusinessEntityAddress changes: ', this.businessEntitysComputed)
    //   });
    // }

    public loadBusinessEntityAddress() {
        this.loadingSignal.set(true);
        this.http
            .get<BusinessEntityAddress[]>(this.apiUrl)
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

    public getBusinessEntityAddress(): Observable<BusinessEntityAddress[]> {
        return this.http.get<BusinessEntityAddress[]>(this.apiUrl)
    }

    public addBusinessEntityAddress(businessEntity: BusinessEntityAddress) {
        this.http
            .post<BusinessEntityAddress>(this.apiUrl, businessEntity)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newBusinessEntityAddress) => {
                    this.businessEntitysSignal.update((businessEntitysComputed) => [...businessEntitysComputed, newBusinessEntityAddress]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updateBusinessEntityAddress(businessEntity: BusinessEntityAddress) {
        this.http.put<BusinessEntityAddress>(this.apiUrl, businessEntity).subscribe({
            next: (updatedBusinessEntityAddress) => {
                this.businessEntitysSignal.update((businessEntity) => businessEntity.map((x) => (x.businessEntityID === updatedBusinessEntityAddress.businessEntityID ? updatedBusinessEntityAddress : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deleteBusinessEntityAddress(businessEntityID: number) {
        this.loadingSignal.set(true);
        this.http.delete<BusinessEntityAddress>(`${this.apiUrl}/${businessEntityID}`).subscribe({
            next: () => {
                this.businessEntitysSignal.update((businessEntitys) => businessEntitys.filter((x) => x.businessEntityID !== businessEntityID));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
