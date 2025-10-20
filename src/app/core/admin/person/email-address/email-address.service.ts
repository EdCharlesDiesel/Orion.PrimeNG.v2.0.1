import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { EmailAddress } from '../../../models/email-address.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class EmailAddressService {
    private apiUrl = environment.personBaseURL + 'emailAddress';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private emailAddresssSignal = signal<EmailAddress[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    emailAddresssComputed = computed(() => this.emailAddresssSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('EmailAddress changes: ', this.emailAddresssComputed)
    //   });
    // }

    public loadEmailAddress() {
        this.loadingSignal.set(true);
        this.http
            .get<EmailAddress[]>(this.apiUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.emailAddresssSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getEmailAddress(): Observable<EmailAddress[]> {
        return this.http.get<EmailAddress[]>(this.apiUrl)
    }

    public addEmailAddress(emailAddress: EmailAddress) {
        this.http
            .post<EmailAddress>(this.apiUrl, emailAddress)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newEmailAddress) => {
                    this.emailAddresssSignal.update((emailAddresssComputed) => [...emailAddresssComputed, newEmailAddress]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updateEmailAddress(emailAddress: EmailAddress) {
        this.http.put<EmailAddress>(this.apiUrl, emailAddress).subscribe({
            next: (updatedEmailAddress) => {
                this.emailAddresssSignal.update((emailAddress) => emailAddress.map((x) => (x.emailAddressID === updatedEmailAddress.emailAddressID ? updatedEmailAddress : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deleteEmailAddress(emailAddressID: number) {
        this.loadingSignal.set(true);
        this.http.delete<EmailAddress>(`${this.apiUrl}/${emailAddressID}`).subscribe({
            next: () => {
                this.emailAddresssSignal.update((emailAddresss) => emailAddresss.filter((x) => x.emailAddressID !== emailAddressID));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
