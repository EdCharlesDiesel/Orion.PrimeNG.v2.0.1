import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CountryRegionCurrency } from '../../../models/country-region-currency.model';
import { StateProvince } from '../../../models/state-province.model';


@Injectable({
    providedIn: 'root'
})
export class CountryRegionCurrencyService {
    private apiUrl = environment.salesBaseURL + 'countryRegionCurrency';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private countryRegionCurrencysSignal = signal<CountryRegionCurrency[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    countryRegionCurrencysComputed = computed(() => this.countryRegionCurrencysSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('CountryRegionCurrency changes: ', this.countryRegionCurrencysComputed)
    //   });
    // }

    public loadCountryRegionCurrency() {
        this.loadingSignal.set(true);
        this.http
            .get<CountryRegionCurrency[]>(this.apiUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.countryRegionCurrencysSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getCountryRegionCurrency(): Observable<CountryRegionCurrency[]> {
        return this.http.get<CountryRegionCurrency[]>(this.apiUrl)
    }

    public addCountryRegionCurrency(countryRegionCurrency: CountryRegionCurrency) {
        this.http
            .post<CountryRegionCurrency>(this.apiUrl, countryRegionCurrency)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newCountryRegionCurrency) => {
                    this.countryRegionCurrencysSignal.update((countryRegionCurrencysComputed) => [...countryRegionCurrencysComputed, newCountryRegionCurrency]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updateCountryRegionCurrency(countryRegionCurrency: CountryRegionCurrency) {
        this.http.put<CountryRegionCurrency>(this.apiUrl, countryRegionCurrency).subscribe({
            next: (updatedCountryRegionCurrency) => {
                // this.countryRegionCurrencysSignal.update((countryRegionCurrency) => countryRegionCurrency.map((x) => (x.countryRegionCurrencyID === updatedCountryRegionCurrency.countryRegionCurrencyID ? updatedCountryRegionCurrency : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deleteCountryRegionCurrency(countryRegionCurrencyID: number) {
        this.loadingSignal.set(true);
        this.http.delete<CountryRegionCurrency>(`${this.apiUrl}/${countryRegionCurrencyID}`).subscribe({
            next: () => {
                // this.countryRegionCurrencysSignal.update((countryRegionCurrencys) => countryRegionCurrencys.filter((x) => x.countryRegionCode !== CountryRegionCurrency));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    addStateProvince(stateProvince: StateProvince) {

    }
}
