import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CountryRegionCurrencyService } from './country-region-currency.service';
import { StateProvince } from '../../../models/state-province.model';
import { Table } from 'primeng/table';



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
    selector: 'app-country-region-currency',
    standalone: true,
    imports: [

    ],
    templateUrl: 'state-province.component.html',
    providers: [MessageService, CountryRegionCurrencyService, ConfirmationService]
})
export class CountryRegionCurrencyComponent implements OnInit {
    stateProvinceDialog: boolean = false;

    stateProvinces = signal<StateProvince[]>([]);

    stateProvince!: StateProvince;

    selectedStateProvinces!: StateProvince[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private stateProvinceService: CountryRegionCurrencyService,
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
        // this.stateProvinceService.getStateProvince().pipe(
        //     tap((p) => console.log(JSON.stringify(p))),
        // ).subscribe((data) => {
        //     this.stateProvinces.set(data);
        //     });

        this.cols = [
            { field: 'StateProvince ID', header: 'Code', customExportHeader: 'StateProvince Code' },
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
        this.stateProvince = {
            stateProvinceID : 0,
            stateProvinceCode: "",
            countryRegionCode: "",
            isOnlyStateProvinceFlag:false,
            name: "",
            territoryID: 0,
            rowguid: "",
            modifiedDate: new Date(),
        };
        this.submitted = false;
        this.stateProvinceDialog = true;
    }

    public editStateProvince(stateProvince: StateProvince) {
        this.stateProvince = { ...stateProvince };
        this.stateProvinceDialog = true;
    }

    public deleteSelectedStateProvinces() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected stateProvinces?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.stateProvinces.set(this.stateProvinces().filter((val) => !this.selectedStateProvinces?.includes(val)));
                this.selectedStateProvinces = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'StateProvinces Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.stateProvinceDialog = false;
        this.submitted = false;
    }

    public deleteStateProvince(stateProvince: StateProvince) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + stateProvince.stateProvinceID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.stateProvinces.set(this.stateProvinces().filter((val) => val.stateProvinceID !== stateProvince.stateProvinceID));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'StateProvince Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.stateProvinces().length; i++) {
            if (this.stateProvinces()[i].stateProvinceID === id) {
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

    public saveStateProvince() {
        this.submitted = true;
        let _stateProvinces = this.stateProvinces();
        if (this.stateProvince.name?.trim()) {
            if (this.stateProvince.stateProvinceID) {
                _stateProvinces[this.findIndexById(this.stateProvince.stateProvinceID)] = this.stateProvince;
                this.stateProvinces.set([..._stateProvinces]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'StateProvince Updated',
                    life: 3000
                });
            } else {
                this.stateProvince.stateProvinceID = this.createId();
                this.stateProvinceService.addStateProvince(this.stateProvince);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'StateProvince Created',
                    life: 3000
                });
                this.stateProvinces.set([..._stateProvinces, this.stateProvince]);
            }

            this.stateProvinceDialog = false;
        }
    }
}

