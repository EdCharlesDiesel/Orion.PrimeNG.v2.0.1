import { environment } from '../../../../../environments/environment';
import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { BusinessEntity } from '../../../models/business-entity.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BusinessEntityContact } from '../../../models/business-entity-contact.model';


@Injectable({
    providedIn: 'root'
})
export class BusinessEntityContactService {
    private apiUrl = environment.personBaseURL + 'businessEntity';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private businessEntitysSignal = signal<BusinessEntity[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    businessEntitysComputed = computed(() => this.businessEntitysSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('BusinessEntity changes: ', this.businessEntitysComputed)
    //   });
    // }

    public loadBusinessEntity() {
        this.loadingSignal.set(true);
        this.http
            .get<BusinessEntity[]>(this.apiUrl)
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

    public getBusinessEntityContact(): Observable<BusinessEntityContact[]> {
        return this.http.get<BusinessEntityContact[]>(this.apiUrl)
    }

    public addBusinessEntityContact(businessEntity: BusinessEntityContact) {
        this.http
            .post<BusinessEntityContact>(this.apiUrl, businessEntity)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newBusinessEntity) => {
                    this.businessEntitysSignal.update((businessEntitysComputed) => [...businessEntitysComputed, newBusinessEntity]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updateBusinessEntityContact(businessEntity: BusinessEntityContact) {
        this.http.put<BusinessEntityContact>(this.apiUrl, businessEntity).subscribe({
            next: (updatedBusinessEntity) => {
                this.businessEntitysSignal.update((businessEntity) => businessEntity.map((x) => (x.businessEntityID === updatedBusinessEntity.businessEntityID ? updatedBusinessEntity : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deleteBusinessEntityContact(businessEntityID: number) {
        this.loadingSignal.set(true);
        this.http.delete<BusinessEntity>(`${this.apiUrl}/${businessEntityID}`).subscribe({
            next: () => {
                this.businessEntitysSignal.update((businessEntitys) => businessEntitys.filter((x) => x.businessEntityID !== businessEntityID));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
