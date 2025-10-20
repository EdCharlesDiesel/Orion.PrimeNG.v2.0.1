import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../../../../shared/http-error.service';
import { CountryRegion } from '../../../models/country-region.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CountryRegionService {
    private apiUrl = environment.personBaseURL + 'countryRegion';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private countryRegionsSignal = signal<CountryRegion[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    countryRegionsComputed = computed(() => this.countryRegionsSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('CountryRegion changes: ', this.countryRegionsComputed)
    //   });
    // }

    public loadCountryRegion() {
        this.loadingSignal.set(true);
        this.http
            .get<CountryRegion[]>(this.apiUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.countryRegionsSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getCountryRegion(): Observable<CountryRegion[]> {
        return this.http.get<CountryRegion[]>(this.apiUrl)
    }

    public addCountryRegion(countryRegion: CountryRegion) {
        this.http
            .post<CountryRegion>(this.apiUrl, countryRegion)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newCountryRegion) => {
                    this.countryRegionsSignal.update((countryRegionsComputed) => [...countryRegionsComputed, newCountryRegion]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updateCountryRegion(countryRegion: CountryRegion) {
        this.http.put<CountryRegion>(this.apiUrl, countryRegion).subscribe({
            next: (updatedCountryRegion) => {
                this.countryRegionsSignal.update((countryRegion) => countryRegion.map((x) => (x.countryRegionCode === updatedCountryRegion.countryRegionCode ? updatedCountryRegion : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deleteCountryRegion(countryRegionCode: string) {
        this.loadingSignal.set(true);
        this.http.delete<CountryRegion>(`${this.apiUrl}/${countryRegionCode}`).subscribe({
            next: () => {
                this.countryRegionsSignal.update((countryRegions) => countryRegions.filter((x) => x.countryRegionCode !== countryRegionCode));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
