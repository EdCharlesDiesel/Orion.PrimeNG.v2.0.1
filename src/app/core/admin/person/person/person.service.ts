import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { Person } from '../../../models/person.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PersonService {
    private apiUrl = environment.personBaseURL + 'person';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private personsSignal = signal<Person[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    personsComputed = computed(() => this.personsSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('Person changes: ', this.personsComputed)
    //   });
    // }

    public loadPerson() {
        this.loadingSignal.set(true);
        this.http
            .get<Person[]>(this.apiUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.personsSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getPersons(): Observable<Person[]> {
        return this.http.get<Person[]>(this.apiUrl)
    }

    public addPerson(person: Person) {
        this.http
            .post<Person>(this.apiUrl, person)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newPerson) => {
                    this.personsSignal.update((personsComputed) => [...personsComputed, newPerson]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updatePerson(person: Person) {
        this.http.put<Person>(this.apiUrl, person).subscribe({
            next: (updatedPerson) => {
                this.personsSignal.update((person) => person.map((x) => (x.businessEntityID === updatedPerson.businessEntityID ? updatedPerson : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deletePerson(businessEntityID: number) {
        this.loadingSignal.set(true);
        this.http.delete<Person>(`${this.apiUrl}/${businessEntityID}`).subscribe({
            next: () => {
                this.personsSignal.update((persons) => persons.filter((x) => x.businessEntityID !== businessEntityID));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
