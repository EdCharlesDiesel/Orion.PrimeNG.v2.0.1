
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExternalEmployeesService } from './external-employees.service';
import { tap } from 'rxjs/operators';
import { SalesPerson } from '../../../models/sales-person.model';
import { Employee } from '../../../models/employee.model';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}
@Component({
    selector: 'app-external-employees',
    templateUrl: './external-employees.component.html',
    standalone: true,
    styleUrls: ['./external-employees.component.scss'],
    imports: [Button, ConfirmDialog, Dialog, IconField, InputIcon, InputText, NgIf, ReactiveFormsModule, TableModule, Toolbar, FormsModule],
    providers: [MessageService,ConfirmationService,ExternalEmployeesService]
})
export class ExternalEmployeesComponent implements OnInit {
    employeeDialog: boolean = false;

    employees = signal<Employee[]>([]);

    employee!: Employee;

    selectedEmployees!: Employee[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private employeeService: ExternalEmployeesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }


    loadDemoData() {
        this.employeeService
            .getEmployees()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe((data) => {
                // @ts-ignore
                return this.employees.set(data);

                //
                // this.employeeService.getEmployees().then((data) => {
                //     this.employees.set(data);
                // });

                // this.employeeService.employeesResult$.subscribe(
                //     (data: any) => {
                //         this.employees.set(data);
            });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'Employee ID', header: 'Code', customExportHeader: 'Employee Code' },
            { field: 'Name', header: 'Name' },
            { field: 'GroupName', header: 'Group Name' },
            { field: 'ModifiedDate', header: 'Modified Date' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    public openNew() {
        this.employee = {
            businessEntityID: 0,
            loginID: '',
            modifiedDate: new Date(),
            birthDate: new Date(),
            currentFlag: true,
            id: '',
            jobTitle: '',
            yearsInService: 0,
            attendedCourses: [],
            gender: '',
            hireDate: new Date(),
            jobLevel: 0,
            maritalStatus: '',
            nationalIDNumber: '',
            salary: 0,
            salariedFlag: false,
            vacationHours: 0,
            sickLeaveHours: 0,
            entityVersion: 0,
            suggestedBonus: 0,
            minimumRaiseGiven: false,
            organizationLevel: 0,
            rowguid: '0',
            organizationNode: 'null',
            documents: [],
            purchaseOrderHeaders: [],
            jobCandidates: [],
            salesPerson: new SalesPerson(),
            employeeDepartmentHistories: [],
            employeePayHistories: []
        };
        this.submitted = false;
        this.employeeDialog = true;
    }

    public editEmployee(employee: Employee) {
        this.employee = { ...employee };
        this.employeeDialog = true;
    }

    public deleteSelectedEmployees() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected employees?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employees.set(this.employees().filter((val) => !this.selectedEmployees?.includes(val)));
                this.selectedEmployees = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employees Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.employeeDialog = false;
        this.submitted = false;
    }

    public deleteEmployee(employee: Employee) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + employee.loginID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employees.set(this.employees().filter((val) => val.businessEntityID !== employee.businessEntityID));
                this.employee = {
                    businessEntityID: 0,
                    loginID: '',
                    modifiedDate: new Date(),
                    birthDate: new Date(),
                    currentFlag: true,
                    id: '',
                    jobTitle: '',
                    yearsInService: 0,
                    attendedCourses: [],
                    gender: '',
                    hireDate: new Date(),
                    jobLevel: 0,
                    maritalStatus: '',
                    nationalIDNumber: '',
                    salary: 0,
                    salariedFlag: false,
                    vacationHours: 0,
                    sickLeaveHours: 0,
                    entityVersion: 0,
                    suggestedBonus: 0,
                    minimumRaiseGiven: false,
                    organizationLevel: 0,
                    rowguid: '0',
                    organizationNode: 'null',
                    documents: [],
                    purchaseOrderHeaders: [],
                    jobCandidates: [],
                    salesPerson: new SalesPerson(),
                    employeeDepartmentHistories: [],
                    employeePayHistories: []
                };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employee Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.employees().length; i++) {
            if (this.employees()[i].businessEntityID === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    private createId(): number {
        let id = 17;
        return ++id;
    }

    public getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    public saveEmployee() {
        this.submitted = true;
        let _employees = this.employees();
        if (this.employee.loginID?.trim()) {
            if (this.employee.businessEntityID) {
                _employees[this.findIndexById(this.employee.businessEntityID)] = this.employee;
                this.employees.set([..._employees]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employee Updated',
                    life: 3000
                });
            } else {
                this.employee.businessEntityID = this.createId();
                this.employeeService.addEmployees(this.employee);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employee Created',
                    life: 3000
                });
                this.employees.set([..._employees, this.employee]);
            }

            this.employeeDialog = false;
            // this.employee = {
            //     EmployeeID : 0,
            //     Name : "",
            //     GroupName :"",
            //     ModifiedDate: new Date(),
            //     EmployeeEmployeeHistories: []
            //  };
        }
    }
}
