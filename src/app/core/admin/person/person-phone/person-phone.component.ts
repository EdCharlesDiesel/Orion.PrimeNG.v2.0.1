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
import { PersonPhoneService } from './person-phone.service';
import { tap } from 'rxjs';
import { PersonPhone } from '../../../models/person-phone.model';


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
    selector: 'app-person-phones',
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
    templateUrl: 'person-phone.component.html',
    providers: [MessageService, PersonPhoneService, ConfirmationService]
})
export class PersonPhoneComponent implements OnInit {
    personPhoneDialog: boolean = false;

    personPhones = signal<PersonPhone[]>([]);

    personPhone!: PersonPhone;

    selectedPersonPhones!: PersonPhone[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private personPhoneService: PersonPhoneService,
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
        this.personPhoneService.getPersonPhones().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
            this.personPhones.set(data);
            });

        this.cols = [
            { field: 'PersonPhone ID', header: 'Code', customExportHeader: 'PersonPhone Code' },
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
        this.personPhone = {
            businessEntityID : 0,
            phoneNumber :"",
            phoneNumberTypeID :0,
            modifiedDate: new Date(),
        };
        this.submitted = false;
        this.personPhoneDialog = true;
    }

    public editPersonPhone(personPhone: PersonPhone) {
        this.personPhone = { ...personPhone };
        this.personPhoneDialog = true;
    }

    public deleteSelectedPersonPhones() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected personPhones?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.personPhones.set(this.personPhones().filter((val) => !this.selectedPersonPhones?.includes(val)));
                this.selectedPersonPhones = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'PersonPhones Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.personPhoneDialog = false;
        this.submitted = false;
    }

    public deletePersonPhone(personPhone: PersonPhone) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + personPhone.businessEntityID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.personPhones.set(this.personPhones().filter((val) => val.businessEntityID !== personPhone.businessEntityID));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'PersonPhone Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.personPhones().length; i++) {
            if (this.personPhones()[i].businessEntityID === id) {
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

    public savePersonPhone() {
        this.submitted = true;
        let _personPhones = this.personPhones();
        if (this.personPhone.phoneNumber?.trim()) {
            if (this.personPhone.businessEntityID) {
                _personPhones[this.findIndexById(this.personPhone.businessEntityID)] = this.personPhone;
                this.personPhones.set([..._personPhones]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'PersonPhone Updated',
                    life: 3000
                });
            } else {
                this.personPhone.businessEntityID = this.createId();
                this.personPhoneService.addPersonPhone(this.personPhone);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'PersonPhone Created',
                    life: 3000
                });
                this.personPhones.set([..._personPhones, this.personPhone]);
            }

            this.personPhoneDialog = false;
        }
    }
}

