import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { DatePipe, NgIf } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CurrencyService } from '../../../../service/currency.service';
import { tap } from 'rxjs';
import { DatePicker } from 'primeng/datepicker';
import { Currency } from '../../../models/currency.model';

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
    selector: 'app-currency',
    standalone: true,
    imports: [Button, ConfirmDialog, Dialog, FormsModule, IconField, InputIcon, InputText, NgIf, TableModule, Toolbar, DatePicker, DatePipe],
    templateUrl: 'currency.component.html',
    providers: [MessageService, CurrencyService, ConfirmationService]
})
export class CurrencyComponent implements OnInit {
    currencyDialog: boolean = false;

    currencys = signal<Currency[]>([]);

    currency!: Currency;

    selectedCurrencys!: Currency[] | null;

    submitted: boolean = false;

    modifiedDateValue: any = null;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private currencyService: CurrencyService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadCurrencyData();
    }

    public loadCurrencyData() {
        this.currencyService
            .getCurrency()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe((data) => {
                this.currencys.set(data);
            });

        this.cols = [
            { field: 'currencyCode', header: 'Code', customExportHeader: 'Currency Code' },
            { field: 'name', header: 'Name' },
            { field: 'modifiedDate', header: 'Modified Date' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    public openNew() {
        this.currency = {
            currencyCode: '',
            modifiedDate: new Date(),
            name: ''
        };
        this.submitted = false;
        this.currencyDialog = true;
    }

    public editCurrency(currency: Currency) {
        currency.modifiedDate = new Date(currency.modifiedDate);
        this.currency = { ...currency };
        this.currencyDialog = true;
    }

    deleteSelectedCurrencys() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected currencys?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.currencys.set(this.currencys().filter((val) => !this.selectedCurrencys?.includes(val)));
                this.selectedCurrencys = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Currencys Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.currencyDialog = false;
        this.submitted = false;
    }

    deleteCurrency(currency: Currency) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + currency.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.currencys.set(this.currencys().filter((val) => val.currencyCode !== currency.currencyCode));

                this.currencyService.deleteCurrency(currency.currencyCode);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Currency Deleted',
                    life: 3000
                });
            }
        });
    }

    public findIndexByCurrencyCode(currencyCode: string): any {
        let index = -1;
        for (let i = 0; i < this.currencys().length; i++) {
            if (this.currencys()[i].currencyCode === currencyCode) {
                index = i;
                break;
            }
        }

        return index;
    }

    public saveCurrency() {
        this.submitted = true;
        let _currencys = this.currencys();
        if (this.currency.name?.trim()) {
            if (this.currency.currencyCode === "") {
                _currencys[this.findIndexByCurrencyCode(this.currency.currencyCode)] = this.currency;
                this.currencys.set([..._currencys]);
                this.currencyService.addCurrency(this.currency);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Currency Updated',
                    life: 3000
                });
            } else {
                this.currencyService.updateCurrency(this.currency);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Currency Created',
                    life: 3000
                });
                this.currencys.set([..._currencys, this.currency]);
            }

            this.currencyDialog = false;
            //this.currency = {};
        }
    }
}

