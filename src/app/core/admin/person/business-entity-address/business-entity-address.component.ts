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
import { BusinessEntityAddressService } from './business-entity-address.service';
import { BusinessEntityAddress } from '../../../models/business-entity-address.model';
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
    selector: 'app-business-entity-address',
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
    templateUrl: 'business-entity-address.component.html',
    providers: [MessageService, BusinessEntityAddressService, ConfirmationService]
})
export class BusinessEntityAddressComponent implements OnInit {
    businessEntityAddressDialog: boolean = false;

    businessEntityAddresses = signal<BusinessEntityAddress[]>([]);

    businessEntityAddress!: BusinessEntityAddress;

    selectedBusinessEntityAddresses!: BusinessEntityAddress[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private businessEntityAddressService: BusinessEntityAddressService,
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
        this.businessEntityAddressService.getBusinessEntityAddress().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
            this.businessEntityAddresses.set(data);
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
        this.businessEntityAddress = {
            addressID: 0,
            businessEntityID: 0,
            addressTypeID: 0,
            rowguid: "",
            modifiedDate: new Date(),
        };
        this.submitted = false;
        this.businessEntityAddressDialog = true;
    }

    public editBusinessEntityAddress(businessEntityAddress: BusinessEntityAddress) {
        this.businessEntityAddress = { ...businessEntityAddress };
        this.businessEntityAddressDialog = true;
    }

    public deleteSelectedBusinessEntityAddress() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected addresss?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.businessEntityAddresses.set(this.businessEntityAddresses().filter((val) => !this.selectedBusinessEntityAddresses?.includes(val)));
                this.selectedBusinessEntityAddresses = null;
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
        this.businessEntityAddressDialog = false;
        this.submitted = false;
    }

    public deleteAddress(address: BusinessEntityAddress) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + address.addressID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.businessEntityAddresses.set(this.businessEntityAddresses().filter((val) => val.addressID !== address.addressID));
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
        for (let i = 0; i < this.businessEntityAddresses().length; i++) {
            if (this.businessEntityAddresses()[i].addressID === id) {
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

    public saveBusinessEntityAddress() {
        this.submitted = true;
        let _businessEntityAddress = this.businessEntityAddresses();
        if (this.businessEntityAddress.addressID ===0) {
            if (this.businessEntityAddress.addressID) {
                _businessEntityAddress[this.findIndexById(this.businessEntityAddress.addressID)] = this.businessEntityAddress;
                this.businessEntityAddresses.set([..._businessEntityAddress]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Address Updated',
                    life: 3000
                });
            } else {
                this.businessEntityAddress.addressID = this.createId();
                this.businessEntityAddressService.addBusinessEntityAddress(this.businessEntityAddress);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Address Created',
                    life: 3000
                });
                this.businessEntityAddresses.set([..._businessEntityAddress, this.businessEntityAddress]);
            }

            this.businessEntityAddressDialog = false;
        }
    }
}

