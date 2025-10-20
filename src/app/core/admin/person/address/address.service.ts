import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { Address } from '../../../models/address.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private apiUrl = environment.personBaseURL + 'address';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private addresssSignal = signal<Address[]>([]);
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
            .get<Address[]>(this.apiUrl)
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

    public getAddresss(): Observable<Address[]> {
        return this.http.get<Address[]>(this.apiUrl)
    }

    public addAddresss(address: Address) {
        this.http
            .post<Address>(this.apiUrl, address)
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

    public updateAddresss(address: Address) {
        this.http.put<Address>(this.apiUrl, address).subscribe({
            next: (updatedAddress) => {
                this.addresssSignal.update((address) => address.map((x) => (x.addressID === updatedAddress.addressID ? updatedAddress : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deleteAddresss(addressID: number) {
        this.loadingSignal.set(true);
        this.http.delete<Address>(`${this.apiUrl}/${addressID}`).subscribe({
            next: () => {
                this.addresssSignal.update((addresss) => addresss.filter((x) => x.addressID !== addressID));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
