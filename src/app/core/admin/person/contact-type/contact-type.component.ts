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
import { ContactTypeService } from './contact-type.service';
import { tap } from 'rxjs';
import { ContactType } from '../../../models/contact-type.model';

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
    selector: 'app-contact-type',
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
    templateUrl: 'contact-type.component.html',
    providers: [MessageService, ContactTypeService, ConfirmationService]
})
export class ContactTypeComponent implements OnInit {
    contactTypeDialog: boolean = false;

    contactTypes = signal<ContactType[]>([]);

    contactType!: ContactType;

    selectedContactTypes!: ContactType[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private contactTypeService: ContactTypeService,
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
        this.contactTypeService.getContactType().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
            this.contactTypes.set(data);
            });

        this.cols = [
            { field: 'ContactType ID', header: 'Code', customExportHeader: 'ContactType Code' },
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
        this.contactType = {
            contactTypeID : 0,
            name:"",
            businessEntityContact: [],
            modifiedDate: new Date(),
        };
        this.submitted = false;
        this.contactTypeDialog = true;
    }

    public editContactType(contactType: ContactType) {
        this.contactType = { ...contactType };
        this.contactTypeDialog = true;
    }

    public deleteSelectedContactTypes() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected contactTypes?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.contactTypes.set(this.contactTypes().filter((val) => !this.selectedContactTypes?.includes(val)));
                this.selectedContactTypes = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ContactTypes Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.contactTypeDialog = false;
        this.submitted = false;
    }

    public deleteContactType(contactType: ContactType) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + contactType.contactTypeID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.contactTypes.set(this.contactTypes().filter((val) => val.contactTypeID !== contactType.contactTypeID));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ContactType Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.contactTypes().length; i++) {
            if (this.contactTypes()[i].contactTypeID === id) {
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

    public saveContactType() {
        this.submitted = true;
        let _contactTypes = this.contactTypes();
        if (this.contactType.name?.trim()) {
            if (this.contactType.contactTypeID) {
                _contactTypes[this.findIndexById(this.contactType.contactTypeID)] = this.contactType;
                this.contactTypes.set([..._contactTypes]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ContactType Updated',
                    life: 3000
                });
            } else {
                this.contactType.contactTypeID = this.createId();
                this.contactTypeService.addContactType(this.contactType);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ContactType Created',
                    life: 3000
                });
                this.contactTypes.set([..._contactTypes, this.contactType]);
            }

            this.contactTypeDialog = false;
        }
    }
}

