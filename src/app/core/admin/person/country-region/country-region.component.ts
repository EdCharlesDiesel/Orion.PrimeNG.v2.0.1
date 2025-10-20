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
import { CountryRegionService } from './country-region.service';
import { tap } from 'rxjs';
import { CountryRegion } from '../../../models/country-region.model';


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
    selector: 'app-country-region',
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
    templateUrl: 'country-region.component.html',
    providers: [MessageService, CountryRegionService, ConfirmationService]
})
export class CountryRegionComponent implements OnInit {
    countryRegionDialog: boolean = false;

    countryRegions = signal<CountryRegion[]>([]);

    countryRegion!: CountryRegion;

    selectedCountryRegions!: CountryRegion[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private countryRegionService: CountryRegionService,
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
        this.countryRegionService.getCountryRegion().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
            this.countryRegions.set(data);
            });

        this.cols = [
            { field: 'CountryRegion ID', header: 'Code', customExportHeader: 'CountryRegion Code' },
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
        this.countryRegion = {
            countryRegionCode : "0",
            name:"",
            modifiedDate: new Date(),
        };
        this.submitted = false;
        this.countryRegionDialog = true;
    }

    public editCountryRegion(countryRegion: CountryRegion) {
        this.countryRegion = { ...countryRegion };
        this.countryRegionDialog = true;
    }

    public deleteSelectedCountryRegions() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected countryRegions?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.countryRegions.set(this.countryRegions().filter((val) => !this.selectedCountryRegions?.includes(val)));
                this.selectedCountryRegions = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'CountryRegions Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.countryRegionDialog = false;
        this.submitted = false;
    }

    public deleteCountryRegion(countryRegion: CountryRegion) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + countryRegion.countryRegionCode + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.countryRegions.set(this.countryRegions().filter((val) => val.countryRegionCode !== countryRegion.countryRegionCode));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'CountryRegion Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: string): string {
        let index = -1;
        for (let i = 0; i < this.countryRegions().length; i++) {
            if (this.countryRegions()[i].countryRegionCode === id) {
                index = i;
                break;
            }
        }

        return String(index);
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

    public saveCountryRegion() {
        this.submitted = true;
        let _countryRegions = this.countryRegions();
        // if (this.countryRegion.name?.trim()) {
        //     if (this.countryRegion.countryRegionCode) {
        //         _countryRegions[this.findIndexById(this.countryRegion.countryRegionCode)] = this.countryRegion;
        //         this.countryRegions.set([..._countryRegions]);
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'CountryRegion Updated',
        //             life: 3000
        //         });
        //     } else {
        //         this.countryRegion.countryRegionCode = this.createId();
        //         this.countryRegionService.addCountryRegion(this.countryRegion);
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'CountryRegion Created',
        //             life: 3000
        //         });
        //         this.countryRegions.set([..._countryRegions, this.countryRegion]);
        //     }

          //  this.countryRegionDialog = false;
    //   }
    }
}

