import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { NgIf } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeePayHistoryService } from './employee-pay-history.service';
import { EmployeePayHistory } from '../../../models/employee-pay-history.model';
import { tap } from 'rxjs/operators';
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
    selector: 'app-employee-pay-history',
    standalone: true,
    templateUrl: './employee-pay-history.component.html',
    styleUrls: ['./employee-pay-history.component.scss'],
    imports: [Button, ReactiveFormsModule, Dialog, TableModule, Toolbar, IconField, InputIcon, FormsModule, NgIf],
    providers: [MessageService,ConfirmationService,EmployeePayHistoryService]
})
export class EmployeePayHistoryComponent implements OnInit {
    employeePayHistoryDialog: boolean = false;

    employeePayHistorys = signal<EmployeePayHistory[]>([]);

    employeePayHistory!: EmployeePayHistory;

    selectedEmployeePayHistorys!: EmployeePayHistory[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private employeePayHistoryService: EmployeePayHistoryService,
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
        this.employeePayHistoryService
            .getEmployeePayHistory()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe((data) => {
                this.employeePayHistorys.set(data);
            });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'EmployeePayHistory ID', header: 'Code', customExportHeader: 'EmployeePayHistory Code' },
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
        this.employeePayHistory = {
            businessEntityID: 0,
            rate: 0,
            payFrequency: 0,
            rateChangeDate: new Date(),
            modifiedDate: new Date(),
            employee: new Employee()
        };
        this.submitted = false;
        this.employeePayHistoryDialog = true;
    }

    public editEmployeePayHistory(employeePayHistory: EmployeePayHistory) {
        this.employeePayHistory = { ...employeePayHistory };
        this.employeePayHistoryDialog = true;
    }

    public deleteSelectedEmployeePayHistorys() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected employeePayHistorys?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employeePayHistorys.set(this.employeePayHistorys().filter((val) => !this.selectedEmployeePayHistorys?.includes(val)));
                this.selectedEmployeePayHistorys = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'EmployeePayHistorys Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.employeePayHistoryDialog = false;
        this.submitted = false;
    }

    public deleteEmployeePayHistory(employeePayHistory: EmployeePayHistory) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + employeePayHistory.businessEntityID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employeePayHistorys.set(this.employeePayHistorys().filter((val) => val.businessEntityID !== employeePayHistory.businessEntityID));
                this.employeePayHistory = {
                    businessEntityID: 0,
                    rate: 0,
                    payFrequency: 0,
                    rateChangeDate: new Date(),
                    modifiedDate: new Date(),
                    employee: new Employee()
                };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'EmployeePayHistory Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.employeePayHistorys().length; i++) {
            if (this.employeePayHistorys()[i].businessEntityID === id) {
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

    public saveEmployeePayHistory() {
        this.submitted = true;
        let _employeePayHistorys = this.employeePayHistorys();

        if (this.employeePayHistory.businessEntityID) {
            _employeePayHistorys[this.findIndexById(this.employeePayHistory.businessEntityID)] = this.employeePayHistory;
            this.employeePayHistorys.set([..._employeePayHistorys]);
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'EmployeePayHistory Updated',
                life: 3000
            });
        } else {
            this.employeePayHistory.businessEntityID = this.createId();
            this.employeePayHistoryService.createEmployeePayHistory(this.employeePayHistory);
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'EmployeePayHistory Created',
                life: 3000
            });
            this.employeePayHistorys.set([..._employeePayHistorys, this.employeePayHistory]);
        }

        this.employeePayHistoryDialog = false;
        // this.employeePayHistory = {
        //     EmployeePayHistoryID : 0,
        //     Name : "",
        //     GroupName :"",
        //     ModifiedDate: new Date(),
        //     EmployeeEmployeePayHistoryHistories: []
        //  };
    }
}

