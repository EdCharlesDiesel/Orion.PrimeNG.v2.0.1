import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { StateProvince } from '../../../models/state-province.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class StateProvinceService {
    private apiUrl = environment.personBaseURL + 'stateProvince';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private stateProvincesSignal = signal<StateProvince[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    stateProvincesComputed = computed(() => this.stateProvincesSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('StateProvince changes: ', this.stateProvincesComputed)
    //   });
    // }

    public loadStateProvince() {
        this.loadingSignal.set(true);
        this.http
            .get<StateProvince[]>(this.apiUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.stateProvincesSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getStateProvince(): Observable<StateProvince[]> {
        return this.http.get<StateProvince[]>(this.apiUrl)
    }

    public addStateProvince(stateProvince: StateProvince) {
        this.http
            .post<StateProvince>(this.apiUrl, stateProvince)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newStateProvince) => {
                    this.stateProvincesSignal.update((stateProvincesComputed) => [...stateProvincesComputed, newStateProvince]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updateStateProvince(stateProvince: StateProvince) {
        this.http.put<StateProvince>(this.apiUrl, stateProvince).subscribe({
            next: (updatedStateProvince) => {
                this.stateProvincesSignal.update((stateProvince) => stateProvince.map((x) => (x.stateProvinceID === updatedStateProvince.stateProvinceID ? updatedStateProvince : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deleteStateProvince(stateProvinceID: number) {
        this.loadingSignal.set(true);
        this.http.delete<StateProvince>(`${this.apiUrl}/${stateProvinceID}`).subscribe({
            next: () => {
                this.stateProvincesSignal.update((stateProvinces) => stateProvinces.filter((x) => x.stateProvinceID !== stateProvinceID));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
