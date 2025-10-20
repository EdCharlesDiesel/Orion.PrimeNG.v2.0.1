import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { PersonPhone } from '../../../models/person-phone.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class PersonPhoneService {
    private apiUrl = environment.personBaseURL + 'personPhone';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private personPhonesSignal = signal<PersonPhone[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    personPhonesComputed = computed(() => this.personPhonesSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('PersonPhone changes: ', this.personPhonesComputed)
    //   });
    // }

    public loadPersonPhone() {
        this.loadingSignal.set(true);
        this.http
            .get<PersonPhone[]>(this.apiUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.personPhonesSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getPersonPhones(): Observable<PersonPhone[]> {
        return this.http.get<PersonPhone[]>(this.apiUrl)
    }

    public addPersonPhone(personPhone: PersonPhone) {
        this.http
            .post<PersonPhone>(this.apiUrl, personPhone)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newPersonPhone) => {
                    this.personPhonesSignal.update((personPhonesComputed) => [...personPhonesComputed, newPersonPhone]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updatePersonPhone(personPhone: PersonPhone) {
        this.http.put<PersonPhone>(this.apiUrl, personPhone).subscribe({
            next: (updatedPersonPhone) => {
                this.personPhonesSignal.update((personPhone) => personPhone.map((x) => (x.businessEntityID === updatedPersonPhone.businessEntityID ? updatedPersonPhone : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deletePersonPhone(personPhoneID: number) {
        this.loadingSignal.set(true);
        this.http.delete<PersonPhone>(`${this.apiUrl}/${personPhoneID}`).subscribe({
            next: () => {
                this.personPhonesSignal.update((personPhones) => personPhones.filter((x) => x.businessEntityID !== personPhoneID));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
