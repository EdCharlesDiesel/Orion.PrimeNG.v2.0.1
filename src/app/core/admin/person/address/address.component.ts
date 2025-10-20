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
import { AddressService } from './address.service';
import { tap } from 'rxjs';
import { Address } from '../../../models/address.model';


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
    selector: 'app-address',
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
    templateUrl: 'address.component.html',
    providers: [MessageService, AddressService, ConfirmationService]
})
export class AddressComponent implements OnInit {
    addressDialog: boolean = false;

    addresss = signal<Address[]>([]);

    address!: Address;

    selectedAddresss!: Address[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private addressService: AddressService,
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
        this.addressService.getAddresss().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
            this.addresss.set(data);
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
        this.address = {
            addressID : 0,
            addressLine1 : "",
            addressLine2 :"",
            city :"",
            stateProvinceID :0,
            postalCode :"",
            spatialLocation: "",
            rowguid: "",
            modifiedDate: new Date(),
        };
        this.submitted = false;
        this.addressDialog = true;
    }

    public editAddress(address: Address) {
        this.address = { ...address };
        this.addressDialog = true;
    }

    public deleteSelectedAddresss() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected addresss?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.addresss.set(this.addresss().filter((val) => !this.selectedAddresss?.includes(val)));
                this.selectedAddresss = null;
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
        this.addressDialog = false;
        this.submitted = false;
    }

    public deleteAddress(address: Address) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + address.addressID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.addresss.set(this.addresss().filter((val) => val.addressID !== address.addressID));
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
        for (let i = 0; i < this.addresss().length; i++) {
            if (this.addresss()[i].addressID === id) {
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

    public saveAddress() {
        this.submitted = true;
        let _addresss = this.addresss();
        if (this.address.addressLine1?.trim()) {
            if (this.address.addressID) {
                _addresss[this.findIndexById(this.address.addressID)] = this.address;
                this.addresss.set([..._addresss]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Address Updated',
                    life: 3000
                });
            } else {
                this.address.addressID = this.createId();
                this.addressService.addAddresss(this.address);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Address Created',
                    life: 3000
                });
                this.addresss.set([..._addresss, this.address]);
            }

            this.addressDialog = false;
        }
    }
}

