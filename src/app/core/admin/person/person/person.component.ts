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
import { PersonService } from './person.service';
import { tap } from 'rxjs';
import { Person } from '../../../models/person.model';


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
    selector: 'app-person',
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
    templateUrl: 'person.component.html',
    providers: [MessageService, PersonService, ConfirmationService]
})
export class PersonComponent implements OnInit {
    personDialog: boolean = false;

    persons = signal<Person[]>([]);

    person!: Person;

    selectedPersons!: Person[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private personService: PersonService,
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
        this.personService.getPersons().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
            this.persons.set(data);
            });

        this.cols = [
            { field: 'Person ID', header: 'Code', customExportHeader: 'Person Code' },
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
        this.person = {
            businessEntityID : 0,
            username: "",
            userTypeId: 0,
            isLoggedIn: false,
            firstName: "",
            lastName: "",
            title: "",
            middleName: "",
            emailPromotion: 1,
            rowguid: "",
            personType: "",
            nameStyle: false,
            suffix: "",
            demographics: "",
            additionalContactInfo: "",


            modifiedDate: new Date(),
        };
        this.submitted = false;
        this.personDialog = true;
    }

    public editPerson(person: Person) {
        this.person = { ...person };
        this.personDialog = true;
    }

    public deleteSelectedPersons() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected person?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.persons.set(this.persons().filter((val) => !this.selectedPersons?.includes(val)));
                this.selectedPersons = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Persons Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.personDialog = false;
        this.submitted = false;
    }

    public deletePerson(person: Person) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + person.businessEntityID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.persons.set(this.persons().filter((val) => val.businessEntityID !== person.businessEntityID));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Person Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.persons().length; i++) {
            if (this.persons()[i].businessEntityID === id) {
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

    public savePerson() {
        this.submitted = true;
        let _person = this.persons();
        if (this.person.firstName?.trim()) {
            if (this.person.businessEntityID) {
                _person[this.findIndexById(this.person.businessEntityID)] = this.person;
                this.persons.set([..._person]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Person Updated',
                    life: 3000
                });
            } else {
                this.person.businessEntityID = this.createId();
                this.personService.addPerson(this.person);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Person Created',
                    life: 3000
                });
                this.persons.set([..._person, this.person]);
            }

            this.personDialog = false;
        }
    }
}

