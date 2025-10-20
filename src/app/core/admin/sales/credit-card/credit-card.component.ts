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
import { CreditCardService } from './credit-card.service';
import { tap } from 'rxjs';
import { CreditCard } from '../../../models/credit-card.model';

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
    selector: 'app-credit-card',
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
    templateUrl: 'credit-card.component.html',
    providers: [MessageService, CreditCardService, ConfirmationService]
})
export class CreditCardComponent implements OnInit {
    creditCardDialog: boolean = false;

    creditCards = signal<CreditCard[]>([]);

    creditCard!: CreditCard;

    selectedCreditCards!: CreditCard[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private creditCardService: CreditCardService,
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
        this.creditCardService.getCreditCard().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
            this.creditCards.set(data);
            });

        this.cols = [
            { field: 'CreditCard ID', header: 'Code', customExportHeader: 'CreditCard Code' },
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
        this.creditCard = {
            creditCardID : 0,
            cardNumber: "0",
            cardType: "",
            expMonth: 0,
            expYear: 0,
            modifiedDate: new Date(),
        };
        this.submitted = false;
        this.creditCardDialog = true;
    }

    public editCreditCard(creditCard: CreditCard) {
        this.creditCard = { ...creditCard };
        this.creditCardDialog = true;
    }

    public deleteSelectedCreditCards() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected creditCards?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.creditCards.set(this.creditCards().filter((val) => !this.selectedCreditCards?.includes(val)));
                this.selectedCreditCards = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'CreditCards Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.creditCardDialog = false;
        this.submitted = false;
    }

    public deleteCreditCard(creditCard: CreditCard) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + creditCard.creditCardID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.creditCards.set(this.creditCards().filter((val) => val.creditCardID !== creditCard.creditCardID));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'CreditCard Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.creditCards().length; i++) {
            if (this.creditCards()[i].creditCardID === id) {
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

    public saveCreditCard() {
        this.submitted = true;
        let _creditCards = this.creditCards();
        if (this.creditCard.cardNumber?.trim()) {
            if (this.creditCard.creditCardID) {
                _creditCards[this.findIndexById(this.creditCard.creditCardID)] = this.creditCard;
                this.creditCards.set([..._creditCards]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'CreditCard Updated',
                    life: 3000
                });
            } else {
                this.creditCard.creditCardID = this.createId();
                this.creditCardService.addCreditCard(this.creditCard);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'CreditCard Created',
                    life: 3000
                });
                this.creditCards.set([..._creditCards, this.creditCard]);
            }

            this.creditCardDialog = false;
        }
    }
}

