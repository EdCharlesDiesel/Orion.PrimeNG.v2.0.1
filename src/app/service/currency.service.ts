import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../shared/http-error.service';
import { Currency } from '../core/models/currency.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    private apiUrl = environment.salesBaseURL + 'currency';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private currencysSignal = signal<Currency[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    currencysComputed = computed(() => this.currencysSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

     constructor() {

     }

    public loadCurrency() {
        this.loadingSignal.set(true);
        this.http
            .get<Currency[]>(this.apiUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.currencysSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getCurrency(): Observable<Currency[]> {
        return this.http.get<Currency[]>(this.apiUrl)
    }

    public addCurrency(currency: Currency) {
        this.http
            .post<Currency>(this.apiUrl, currency)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newCurrency) => {
                    // this.currencysSignal.
                    // this.currencysSignal.update((currencysComputed) => [...currencysComputed, newCurrency]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updateCurrency(currency: Currency) {
        this.http.put<Currency>(`${this.apiUrl}/${currency.currencyCode}`, currency).subscribe({
            next: (updatedCurrency) => {
                this.currencysSignal.update((currency) => currency.map((x) => (x.currencyCode === updatedCurrency.currencyCode ? updatedCurrency : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    public deleteCurrency(currencyCode: string) {
        this.loadingSignal.set(true);
        this.http.delete<Currency>(`${this.apiUrl}/${currencyCode}`).subscribe({
            next: () => {
                this.currencysSignal.update((currencys) => currencys.filter((x) => x.currencyCode !== currencyCode));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
