import { Component,  OnInit, signal, ViewChild } from '@angular/core';
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
import { ProductService } from '../../../../../service/product.service';
import { Product } from '../../../../models/product';
import { tap } from 'rxjs/operators';
import { ExportColumn } from '../../../../models/ExportColumn';
import { IColumn } from '../../interfaces/IColumn';
import { Card } from 'primeng/card';
import { Department } from '../../../models/department.model';




@Component({
    selector: 'app-admin-product-list',
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
        Toolbar,
        TableModule,
        ConfirmDialogModule,
        DialogModule,

    ],
    templateUrl: 'admin-product-list.component.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class AdminProductListComponent implements OnInit {
    productsSignal = signal<Product[]>([]);
    product!: Product;
    selectedProducts!: Product[] | null;
    submitted: boolean = false;
    statuses!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: IColumn[];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
         this.loadProductsData();
    }

    private loadProductsData() {
        this.productService
            .getProducts()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe((data: any) => {
                this.productsSignal.set(data);
            });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'Product ID', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'Name', header: 'Name' },
            { field: 'GroupName', header: 'Group Name' },
            { field: 'ModifiedDate', header: 'Modified Date' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    public deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    public deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.productID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.product = {
                    availableUntil: undefined,
                    discountPercentage: undefined,
                    discountPrice: undefined,
                    isFeatured: false,
                    isNew: undefined,
                    originalPrice: undefined,
                    tags: undefined,
                    productID: 0,
                    inventoryStatus: '',
                    code: 0,
                    discontinuedDate: new Date(),
                    sellEndDate: new Date(),
                    sellStartDate: new Date(),
                    productLine: '',
                    style: '',
                    weight: 0,
                    productNumber: '',
                    class: '',
                    size: '',
                    safetyStockLevel: 0,
                    listPrice: 0,
                    daysToManufacture: 0,
                    reorderPoint: 0,
                    color: '',
                    makeFlag: false,
                    name: '',
                    imageUrl: '',
                    standardCost: 0,
                    price: 0,
                    weightUnitMeasureCode: '',
                    sizeUnitMeasureCode: '',
                    finishedGoodsFlag: false,
                    description: '',
                    productModelID: 0,
                    quantityInStock: 0,
                    title: '',
                    modifiedDate: new Date()
                };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }
}

