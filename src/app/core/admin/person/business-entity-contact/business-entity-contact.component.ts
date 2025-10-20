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
import { BusinessEntityContactService } from './business-entity-contact.service';
import { tap } from 'rxjs';
import { BusinessEntityContact } from '../../../models/business-entity-contact.model';


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
    selector: 'app-business-entity-contact',
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
    templateUrl: 'business-entity-contact.component.html',
    providers: [MessageService, BusinessEntityContactService, ConfirmationService]
})
export class BusinessEntityContactComponent implements OnInit {
    businessEntityContactDialog: boolean = false;

    businessEntityContacts = signal<BusinessEntityContact[]>([]);

    businessEntityContact!: BusinessEntityContact;

    selectedBusinessEntityContacts!: BusinessEntityContact[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private businessEntityContactService: BusinessEntityContactService,
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
        this.businessEntityContactService.getBusinessEntityContact().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
            this.businessEntityContacts.set(data);
            });

        this.cols = [
            { field: 'BusinessEntityContact ID', header: 'Code', customExportHeader: 'BusinessEntityContact Code' },
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
        this.businessEntityContact = {
            businessEntityID : 0,
            contactTypeID: 0,
            rowguid: "",
            personID: 0,
            modifiedDate: new Date(),
        };
        this.submitted = false;
        this.businessEntityContactDialog = true;
    }

    public editBusinessEntityContact(businessEntityContact: BusinessEntityContact) {
        this.businessEntityContact = { ...businessEntityContact };
        this.businessEntityContactDialog = true;
    }

    public deleteSelectedBusinessEntityContacts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected businessEntityContacts?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.businessEntityContacts.set(this.businessEntityContacts().filter((val) => !this.selectedBusinessEntityContacts?.includes(val)));
                this.selectedBusinessEntityContacts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'BusinessEntityContacts Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.businessEntityContactDialog = false;
        this.submitted = false;
    }

    public deleteBusinessEntityContact(businessEntityContact: BusinessEntityContact) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + businessEntityContact.businessEntityID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.businessEntityContacts.set(this.businessEntityContacts().filter((val) => val.businessEntityID !== businessEntityContact.businessEntityID));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'BusinessEntityContact Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.businessEntityContacts().length; i++) {
            if (this.businessEntityContacts()[i].businessEntityID === id) {
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

    public saveBusinessEntityContact() {
        this.submitted = true;
        let _businessEntityContacts = this.businessEntityContacts();
        if (this.businessEntityContact.contactTypeID) {
            if (this.businessEntityContact.businessEntityID) {
                _businessEntityContacts[this.findIndexById(this.businessEntityContact.businessEntityID)] = this.businessEntityContact;
                this.businessEntityContacts.set([..._businessEntityContacts]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'BusinessEntityContact Updated',
                    life: 3000
                });
            } else {
                this.businessEntityContact.businessEntityID = this.createId();
                this.businessEntityContactService.addBusinessEntityContact(this.businessEntityContact);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'BusinessEntityContact Created',
                    life: 3000
                });
                this.businessEntityContacts.set([..._businessEntityContacts, this.businessEntityContact]);
            }

            this.businessEntityContactDialog = false;
        }
    }
}

