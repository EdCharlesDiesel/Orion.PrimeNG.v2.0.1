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
import { AddressTypeService } from './address-type.service';
import { AddressType } from '../../../models/address-type.model';
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
    selector: 'app-addressTypeId',
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
    templateUrl: 'address-type.component.html',
    providers: [MessageService, AddressTypeService, ConfirmationService]
})
export class AddressTypeComponent implements OnInit {
    addressDialog: boolean = false;

    addresss = signal<AddressType[]>([]);

    address!: AddressType;

    selectedAddresss!: AddressType[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private addressService: AddressTypeService,
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
            addressTypeId : 0,
            name : "",
            rowguid: "",
            modifiedDate: new Date(),
        };
        this.submitted = false;
        this.addressDialog = true;
    }

    public editAddress(address: AddressType) {
        this.address = { ...address };
        this.addressDialog = true;
    }

    public deleteSelectedAddresss() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected AddressType?',
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

    public deleteAddress(address: AddressType) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + address.addressTypeId + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.addresss.set(this.addresss().filter((val) => val.addressTypeId !== address.addressTypeId));
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
            if (this.addresss()[i].addressTypeId === id) {
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
        if (this.address.name?.trim()) {
            if (this.address.addressTypeId) {
                _addresss[this.findIndexById(this.address.addressTypeId)] = this.address;
                this.addresss.set([..._addresss]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Address Updated',
                    life: 3000
                });
            } else {
                this.address.addressTypeId = this.createId();
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

