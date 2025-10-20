import { Observable,tap } from 'rxjs';
import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { AddressType } from '../../../models/address-type.model';



@Injectable({
    providedIn: 'root'
})
export class AddressTypeService {
    private apiUrl = environment.personBaseURL + 'AddressTypes';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private addresssSignal = signal<AddressType[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    addresssComputed = computed(() => this.addresssSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('Addresss changes: ', this.addresssComputed)
    //   });
    // }

    public loadAddresss() {
        this.loadingSignal.set(true);
        this.http
            .get<AddressType[]>(this.apiUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.addresssSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getAddresss(): Observable<AddressType[]> {
        return this.http.get<AddressType[]>(this.apiUrl)
    }

    public addAddresss(address: AddressType) {
        this.http
            .post<AddressType>(this.apiUrl, address)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newAddress) => {
                    this.addresssSignal.update((addresssComputed) => [...addresssComputed, newAddress]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updateAddresss(address: AddressType) {
        this.http.put<AddressType>(this.apiUrl, address).subscribe({
            next: (updatedAddress) => {
                this.addresssSignal.update((address) => address.map((x) => (x.addressTypeId === updatedAddress.addressTypeId ? updatedAddress : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deleteAddresss(addressTypeId: number) {
        this.loadingSignal.set(true);
        this.http.delete<AddressType>(`${this.apiUrl}/${addressTypeId}`).subscribe({
            next: () => {
                this.addresssSignal.update((addresss) => addresss.filter((x) => x.addressTypeId !== addressTypeId));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
