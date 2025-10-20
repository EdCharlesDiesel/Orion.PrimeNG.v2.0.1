import { Observable,tap } from 'rxjs';
import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Department } from './department.model';
import { environment } from '../../../../../environments/environment';
import { HttpErrorService } from '../../../../shared/http-error.service';


@Injectable({
    providedIn: 'root'
})
export class DepartmentsService {
    private DepartmentsUrl = environment.humanResourcesBaseURL + 'department';
    private http = inject(HttpClient);
    private errorService = inject(HttpErrorService);

    //Signal state
    private departmentsSignal = signal<Department[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    //public computed signals
    departmentsComputed = computed(() => this.departmentsSignal);
    isLoadingComputed = computed(() => this.loadingSignal);
    errorComputed = computed(() => this.errorSignal);

    // constructor() {
    //   effect(() => {
    //     console.log('Departments changes: ', this.departmentsComputed)
    //   });
    // }

    public loadDepartments() {
        this.loadingSignal.set(true);
        this.http
            .get<Department[]>(this.DepartmentsUrl)
            .pipe(
                tap({
                    next: (data) => {
                        this.departmentsSignal.set(data);
                        this.errorSignal.set(null);
                    },
                    error: (err) => this.errorSignal.set(err.message),
                    finalize: () => this.loadingSignal.set(false),

                }),
            ).subscribe();
    }

    public getDepartments(): Observable<Department[]> {
        return this.http.get<Department[]>(this.DepartmentsUrl)
    }

    public addDepartments(department: Department) {
        this.http
            .post<Department>(this.DepartmentsUrl, department)
            .pipe(tap((data) => console.log(data)))
            .subscribe({
                next: (newDepartment) => {
                    this.departmentsSignal.update((departmentsComputed) => [...departmentsComputed, newDepartment]);
                },
                error: (err: any) => {
                    this.errorSignal.set(err.message);
                }
            });
    }

    public updateDepartments(department: Department) {
        this.http.put<Department>(this.DepartmentsUrl, department).subscribe({
            next: (updatedDepartment) => {
                this.departmentsSignal.update((department) => department.map((x) => (x.DepartmentID === updatedDepartment.DepartmentID ? updatedDepartment : x)));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }

    deleteDepartments(departmentID: number) {
        this.loadingSignal.set(true);
        this.http.delete<Department>(`${this.DepartmentsUrl}/${departmentID}`).subscribe({
            next: () => {
                this.departmentsSignal.update((departments) => departments.filter((x) => x.DepartmentID !== departmentID));
            },
            error: (err: any) => {
                this.errorSignal.set(err.message);
            }
        });
    }
}
