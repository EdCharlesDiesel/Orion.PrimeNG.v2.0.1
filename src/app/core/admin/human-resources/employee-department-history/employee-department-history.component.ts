
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeDepartmentHistory } from '../../../models/employee-department-history.model ';
import { EmployeeDepartmentHistoryService } from './employee-department-history.service';
import { tap } from 'rxjs/operators';
import { Shift } from '../../../models/shift.model';


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
    selector: 'app-employee-department-history',
    templateUrl: './employee-department-history.component.html',
    styleUrls: ['./employee-department-history.component.scss'],
    imports: [Button, ConfirmDialog, Dialog, IconField, InputIcon, InputText, NgIf, ReactiveFormsModule, TableModule, Toolbar, FormsModule],
    providers: [MessageService,ConfirmationService,EmployeeDepartmentHistoryService]
})
export class EmployeeDepartmentHistoryComponent implements OnInit {
    systemInfoList: EmployeeDepartmentHistory[] = [];
    employeeDepartmentHistoryDialog: boolean = false;

    employeeDepartmentHistorys = signal<EmployeeDepartmentHistory[]>([]);

    employeeDepartmentHistory!: EmployeeDepartmentHistory;

    selectedEmployeeDepartmentHistorys!: EmployeeDepartmentHistory[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private employeeDepartmentHistoryService: EmployeeDepartmentHistoryService,
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
        this.employeeDepartmentHistoryService
            .getEmployeeDepartmentHistory()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe((data) => {
                this.employeeDepartmentHistorys.set(data);

                //
                // this.employeeDepartmentHistoryService.getEmployeeDepartmentHistorys().then((data) => {
                //     this.employeeDepartmentHistorys.set(data);
                // });

                // this.employeeDepartmentHistoryService.employeeDepartmentHistorysResult$.subscribe(
                //     (data: any) => {
                //         this.employeeDepartmentHistorys.set(data);
            });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'EmployeeDepartmentHistory ID', header: 'Code', customExportHeader: 'EmployeeDepartmentHistory Code' },
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
        this.employeeDepartmentHistory = {
            businessEntityID: 0,
            shiftID: 0,
            shift: new Shift(),
            startDate: new Date(),
            endDate: new Date(),
            modifiedDate: new Date(),
            departmentID: 0
        };
        this.submitted = false;
        this.employeeDepartmentHistoryDialog = true;
    }

    public editEmployeeDepartmentHistory(employeeDepartmentHistory: EmployeeDepartmentHistory) {
        this.employeeDepartmentHistory = { ...employeeDepartmentHistory };
        this.employeeDepartmentHistoryDialog = true;
    }

    public deleteSelectedEmployeeDepartmentHistorys() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected employeeDepartmentHistorys?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employeeDepartmentHistorys.set(this.employeeDepartmentHistorys().filter((val) => !this.selectedEmployeeDepartmentHistorys?.includes(val)));
                this.selectedEmployeeDepartmentHistorys = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'EmployeeDepartmentHistorys Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.employeeDepartmentHistoryDialog = false;
        this.submitted = false;
    }

    public deleteEmployeeDepartmentHistory(employeeDepartmentHistory: EmployeeDepartmentHistory) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + employeeDepartmentHistory.businessEntityID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employeeDepartmentHistorys.set(this.employeeDepartmentHistorys().filter((val) => val.businessEntityID !== employeeDepartmentHistory.businessEntityID));
                this.employeeDepartmentHistory = {
                    businessEntityID: 0,
                    shiftID: 0,
                    shift: new Shift(),
                    startDate: new Date(),
                    endDate: new Date(),
                    modifiedDate: new Date(),
                    departmentID: 0
                };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'EmployeeDepartmentHistory Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.employeeDepartmentHistorys().length; i++) {
            if (this.employeeDepartmentHistorys()[i].businessEntityID === id) {
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

    public saveEmployeeDepartmentHistory() {
        this.submitted = true;
        let _employeeDepartmentHistorys = this.employeeDepartmentHistorys();

        if (this.employeeDepartmentHistory.businessEntityID) {
            _employeeDepartmentHistorys[this.findIndexById(this.employeeDepartmentHistory.businessEntityID)] = this.employeeDepartmentHistory;
            this.employeeDepartmentHistorys.set([..._employeeDepartmentHistorys]);
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'EmployeeDepartmentHistory Updated',
                life: 3000
            });
        } else {
            this.employeeDepartmentHistory.businessEntityID = this.createId();
            this.employeeDepartmentHistoryService.createEmployeeDepartmentHistory(this.employeeDepartmentHistory);
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'EmployeeDepartmentHistory Created',
                life: 3000
            });
            this.employeeDepartmentHistorys.set([..._employeeDepartmentHistorys, this.employeeDepartmentHistory]);
        }

        this.employeeDepartmentHistoryDialog = false;
        // this.department = {
        //     EmployeeDepartmentHistoryID : 0,
        //     Name : "",
        //     GroupName :"",
        //     ModifiedDate: new Date(),
        //     EmployeeDepartmentHistories: []
        //  };
    }
}

