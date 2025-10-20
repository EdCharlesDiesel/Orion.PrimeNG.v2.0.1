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
import { EmailAddressService } from './email-address.service';
import { EmailAddress } from '../../../models/email-address.model';
import { tap } from 'rxjs/operators';



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
    selector: 'app-email-address',
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
    templateUrl: 'email-address.component.html',
    providers: [MessageService, EmailAddressService, ConfirmationService]
})
export class EmailAddressComponent implements OnInit {
    emailAddressDialog: boolean = false;

    emailAddresses = signal<EmailAddress[]>([]);

    emailAddress!: EmailAddress;

    selectedEmailAddresses!: EmailAddress[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private emailAddressService: EmailAddressService,
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
        this.emailAddressService.getEmailAddress().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
            this.emailAddresses.set(data);
            });

        this.cols = [
            { field: 'Address ID', header: 'Code', customExportHeader: 'Address Code' },
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
        this.emailAddress = {
            rowguid: '',
            emailAddressID: 0,
            personalEmailAddress: "",
            businessEntityID: 0,
            modifiedDate: new Date()
        };
        this.submitted = false;
        this.emailAddressDialog = true;
    }

    public editEmailAddress(emailAddress: EmailAddress) {
        this.emailAddress = { ...emailAddress };
        this.emailAddressDialog = true;
    }

    public deleteSelectedEmailAddress() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected addresss?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.emailAddresses.set(this.emailAddresses().filter((val) => !this.selectedEmailAddresses?.includes(val)));
                this.selectedEmailAddresses = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Addresss Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.emailAddressDialog = false;
        this.submitted = false;
    }

    public deleteEmailAddress(emailAddress: EmailAddress) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + emailAddress.personalEmailAddress + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.emailAddresses.set(this.emailAddresses().filter((val) => val.emailAddressID !== emailAddress.emailAddressID));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Address Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.emailAddresses().length; i++) {
            if (this.emailAddresses()[i].emailAddressID === id) {
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

    public saveEmailAddress() {
        this.submitted = true;
        let _emailAddress = this.emailAddresses();
        if (this.emailAddress.personalEmailAddress?.trim()) {
            if (this.emailAddress.emailAddressID) {
                _emailAddress[this.findIndexById(this.emailAddress.emailAddressID)] = this.emailAddress;
                this.emailAddresses.set([..._emailAddress]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Address Updated',
                    life: 3000
                });
            } else {
                this.emailAddress.emailAddressID = this.createId();
                this.emailAddressService.addEmailAddress(this.emailAddress);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Address Created',
                    life: 3000
                });
                this.emailAddresses.set([..._emailAddress, this.emailAddress]);
            }

            this.emailAddressDialog = false;
        }
    }
}

