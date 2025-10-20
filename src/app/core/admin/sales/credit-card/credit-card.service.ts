import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { CreditCard } from '../../../models/credit-card.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CreditCardService {
    private apiUrl = environment.salesBaseURL + 'creditCard';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private creditCardsSignal = signal<CreditCard[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    creditCardsComputed = computed(() => this.creditCardsSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('CreditCard changes: ', this.creditCardsComputed)
    //   });
    // }

    public loadCreditCard() {
        this.loadingSignal.set(true);
        this.http
            .get<CreditCard[]>(this.apiUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.creditCardsSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getCreditCard(): Observable<CreditCard[]> {
        return this.http.get<CreditCard[]>(this.apiUrl)
    }

    public addCreditCard(creditCard: CreditCard) {
        this.http
            .post<CreditCard>(this.apiUrl, creditCard)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newCreditCard) => {
                    this.creditCardsSignal.update((creditCardsComputed) => [...creditCardsComputed, newCreditCard]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updateCreditCard(creditCard: CreditCard) {
        this.http.put<CreditCard>(this.apiUrl, creditCard).subscribe({
            next: (updatedCreditCard) => {
                this.creditCardsSignal.update((creditCard) => creditCard.map((x) => (x.creditCardID === updatedCreditCard.creditCardID ? updatedCreditCard : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deleteCreditCard(creditCardID: number) {
        this.loadingSignal.set(true);
        this.http.delete<CreditCard>(`${this.apiUrl}/${creditCardID}`).subscribe({
            next: () => {
                this.creditCardsSignal.update((creditCards) => creditCards.filter((x) => x.creditCardID !== creditCardID));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
