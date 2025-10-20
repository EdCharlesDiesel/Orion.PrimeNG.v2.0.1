import { Component, OnInit, signal, ViewChild } from '@angular/core';
import {  ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeesService } from './employees.service';
import { tap } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { KnobModule } from 'primeng/knob';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
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
    selector: 'app-employees',
    standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SelectButtonModule,
    InputGroupModule,
    FluidModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    AutoCompleteModule,
    InputNumberModule,
    SliderModule,
    RatingModule,
    ColorPickerModule,
    KnobModule,
    SelectModule,
    DatePickerModule,
    ToggleButtonModule,
    ToggleSwitchModule,
    TreeSelectModule,
    MultiSelectModule,
    ListboxModule,
    InputGroupAddonModule,
    TextareaModule,
    Toolbar,
    TableModule,
    ConfirmDialogModule,
    DialogModule
  ],
    templateUrl: 'employees.component.html',
    providers: [MessageService, EmployeesService, ConfirmationService]
})
export class EmployeesComponent implements OnInit {
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
        private employeeService: EmployeesService,
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
        this.employeeService.getEmployees().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data): any => {
        //    this.employees.set(data);

        //
        // this.employeeService.getEmployees().then((data) => {
        //     this.employees.set(data);
        // });

        // this.employeeService.employeesResult$.subscribe(
        //     (data: any) => {
        //         this.employees.set(data);
             }
        );

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'Employee ID', header: 'Code', customExportHeader: 'Employee Code' },
            { field: 'Name', header: 'Name' },
            { field: 'GroupName', header: 'Group Name' },
            { field: 'ModifiedDate', header: 'Modified Date' },
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    public openNew() {
        this.employee = {
            businessEntityID : 0,
            nationalIDNumber: "",
            loginID: "",
            organizationLevel:1,
            jobTitle: "",
            birthDate: new Date(),
            maritalStatus: "",
            gender: "",
            hireDate: new Date(),
            salariedFlag: false,
            vacationHours: 0,
            sickLeaveHours:0,
            currentFlag:false,
            modifiedDate: new Date()
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
                    detail: 'EmployeesComponent Deleted',
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
            message: 'Are you sure you want to delete employee ID:' + employee.businessEntityID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employees.set(this.employees().filter((val) => val.businessEntityID !== employee.businessEntityID));
                this.employee = {
                    businessEntityID : 0,
                    nationalIDNumber: "",
                    loginID: "",
                    organizationLevel:1,
                    jobTitle: "",
                    birthDate: new Date(),
                    maritalStatus: "",
                    gender: "",
                    hireDate: new Date(),
                    salariedFlag: false,
                    vacationHours: 0,
                    sickLeaveHours:0,
                    currentFlag:false,
                    modifiedDate: new Date()
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
                this.employeeService.createEmployee(this.employee)
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employee Created',
                    life: 3000
                });
                this.employees.set([..._employees, this.employee]);
            }

            this.employeeDialog = false;
            this.employee = {
                businessEntityID : 0,
                nationalIDNumber: "",
                loginID: "",
                organizationLevel:1,
                jobTitle: "",
                birthDate: new Date(),
                maritalStatus: "",
                gender: "",
                hireDate: new Date(),
                salariedFlag: false,
                vacationHours: 0,
                sickLeaveHours:0,
                currentFlag:false,
                modifiedDate: new Date()
            };
        }
    }
}

