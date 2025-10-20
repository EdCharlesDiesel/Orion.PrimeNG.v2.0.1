import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PhoneNumberTypeService } from './phone-number-type.service';
import { tap } from 'rxjs';
import { PhoneNumberType } from '../../../models/phone-number-type.model';



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
    selector: 'app-phone-number-Type',
    standalone: true,
    imports: [
        Button,
        ConfirmDialog,
        Dialog,
        FormsModule,
        IconField,
        InputIcon,
        InputText,
        NgIf,
        TableModule,
        Toolbar
    ],
    templateUrl: 'phone-number-type.component.html',
    providers: [MessageService, PhoneNumberTypeService, ConfirmationService]
})
export class PhoneNumberTypeComponent implements OnInit {
    phoneNumberTypeDialog: boolean = false;

    phoneNumberTypes = signal<PhoneNumberType[]>([]);

    phoneNumberType!: PhoneNumberType;

    selectedPhoneNumberTypes!: PhoneNumberType[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private phoneNumberTypeService: PhoneNumberTypeService,
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
        this.phoneNumberTypeService.getPersonNumberTypes().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
            this.phoneNumberTypes.set(data);
            });

        this.cols = [
            { field: 'PhoneNumberType ID', header: 'Code', customExportHeader: 'PhoneNumberType Code' },
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
        this.phoneNumberType = {
            name :"",
            personPhones: [],
            phoneNumberTypeID : 0,
            modifiedDate: new Date(),
        };
        this.submitted = false;
        this.phoneNumberTypeDialog = true;
    }

    public editPhoneNumberType(phoneNumberType: PhoneNumberType) {
        this.phoneNumberType = { ...phoneNumberType };
        this.phoneNumberTypeDialog = true;
    }

    public deleteSelectedPhoneNumberTypes() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected phoneNumberTypes?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.phoneNumberTypes.set(this.phoneNumberTypes().filter((val) => !this.selectedPhoneNumberTypes?.includes(val)));
                this.selectedPhoneNumberTypes = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'PhoneNumberTypes Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.phoneNumberTypeDialog = false;
        this.submitted = false;
    }

    public deletePhoneNumberType(phoneNumberType: PhoneNumberType) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + phoneNumberType.phoneNumberTypeID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.phoneNumberTypes.set(this.phoneNumberTypes().filter((val) => val.phoneNumberTypeID !== phoneNumberType.phoneNumberTypeID));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'PhoneNumberType Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.phoneNumberTypes().length; i++) {
            if (this.phoneNumberTypes()[i].phoneNumberTypeID === id) {
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

    public savePhoneNumberType() {
        this.submitted = true;
        let _phoneNumberTypes = this.phoneNumberTypes();
        if (this.phoneNumberType.name?.trim()) {
            if (this.phoneNumberType.phoneNumberTypeID) {
                _phoneNumberTypes[this.findIndexById(this.phoneNumberType.phoneNumberTypeID)] = this.phoneNumberType;
                this.phoneNumberTypes.set([..._phoneNumberTypes]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'PhoneNumberType Updated',
                    life: 3000
                });
            } else {
                this.phoneNumberType.phoneNumberTypeID = this.createId();
                this.phoneNumberTypeService.addPersonNumberType(this.phoneNumberType);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'PhoneNumberType Created',
                    life: 3000
                });
                this.phoneNumberTypes.set([..._phoneNumberTypes, this.phoneNumberType]);
            }

            this.phoneNumberTypeDialog = false;
        }
    }
}

