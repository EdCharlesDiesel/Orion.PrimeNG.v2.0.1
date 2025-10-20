
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { KnobModule } from 'primeng/knob';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { Toolbar } from 'primeng/toolbar';
import { Table, TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductVendorService } from '../../../../service/product-vendor.service';
import { tap } from 'rxjs';
import { ProductVendor } from '../../../models/product-vendor.model';


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
    selector: 'app-product-vendors',
    standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SelectButtonModule,
    InputGroupModule,
    FluidModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    AutoCompleteModule,
    InputNumberModule,
    SliderModule,
    RatingModule,
    ColorPickerModule,
    KnobModule,
    SelectModule,
    DatePickerModule,
    ToggleButtonModule,
    ToggleSwitchModule,
    TreeSelectModule,
    MultiSelectModule,
    ListboxModule,
    InputGroupAddonModule,
    TextareaModule,
    TableModule,
    ConfirmDialogModule,
    DialogModule
  ],
    templateUrl: 'product-vendors.component.html',
    providers: [MessageService, ProductVendorService, ConfirmationService]
})
export class ProductVendorComponent implements OnInit {
    productVendorDialog: boolean = false;

    productVendors = signal<ProductVendorComponent[]>([]);

    productVendor!: ProductVendor;

    selectedProductVendors!: ProductVendorComponent[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private productVendorService: ProductVendorService,
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
        this.productVendorService.getProductVendors().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
                // this.productVendors.set(data);

                //
                // this.product-vendorService.getProductVendors().then((data) => {
                //     this.product-vendors.set(data);
                // });

                // this.product-vendorService.product-vendorsResult$.subscribe(
                //     (data: any) => {
                //         this.product-vendors.set(data);
            }
        );

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'ProductVendor ID', header: 'Code', customExportHeader: 'ProductVendor Code' },
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
        this.productVendor = {
            businessEntityID : 0,
            productID:0,
            averageLeadTime: 0,
            standardPrice:0,
            lastReceiptCost:0,
            lastReceiptDate: new Date(),
            minOrderQty: 0,
            maxOrderQty:0,
            onOrderQty:0,
            unitMeasureCode: '0',
            modifiedDate: new Date(),

        };
        this.submitted = false;
        this.productVendorDialog = true;
    }

    public editProductVendor(productVendor: ProductVendor) {
        this.productVendor = { ...productVendor };
        this.productVendorDialog = true;
    }

    public deleteSelectedProductVendors() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected productVendors?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productVendors.set(this.productVendors().filter((val) => !this.selectedProductVendors?.includes(val)));
                this.selectedProductVendors = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ProductVendors Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.productVendorDialog = false;
        this.submitted = false;
    }

    public deleteProductVendor(productVendor: ProductVendor) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + productVendor.businessEntityID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // this.productVendors.set(this.productVendors().filter((val) => val.productID !== productVendor.productID));
                this.productVendor = {
                    businessEntityID : 0,
                    productID:0,
                    averageLeadTime: 0,
                    standardPrice:0,
                    lastReceiptCost:0,
                    lastReceiptDate: new Date(),
                    minOrderQty: 0,
                    maxOrderQty:0,
                    onOrderQty:0,
                    unitMeasureCode: '0',
                    modifiedDate: new Date(),
                };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ProductVendor Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.productVendors().length; i++) {
            // if (this.productVendors()[i].productID === id) {
            //     index = i;
            //     break;
            // }
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

    public saveProductVendor() {
        this.submitted = true;
        let _productVendors = this.productVendors();
        if (this.productVendor.productID) {
            if (this.productVendor.productID) {
                // _productVendors[this.findIndexById(this.productVendor.productID)] = this.productVendor;
                this.productVendors.set([..._productVendors]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ProductVendor Updated',
                    life: 3000
                });
            } else {
                this.productVendor.businessEntityID = this.createId();
                this.productVendorService.createProductVendor(this.productVendor);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ProductVendor Created',
                    life: 3000
                });
                // this.productVendors.set([..._productVendors, this.productVendor]);
            }

            this.productVendorDialog = false;
            // this.productVendor = {
            //     ProductVendorID : 0,
            //     Name : "",
            //     GroupName :"",
            //     ModifiedDate: new Date(),
            //     EmployeeProductVendorHistories: []
            //  };
        }
    }
}

