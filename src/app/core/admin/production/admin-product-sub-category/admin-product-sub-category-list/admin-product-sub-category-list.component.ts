import { Component, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { ProductSubcategory } from '../../../../models/product-subcategory.model';
import { Column } from '../../../../models/Column';
import { ProductSubCategoryService } from '../../../services/product-sub-category-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-admin-product-sub-category-list',
    templateUrl: 'admin-product-sub-category-list.component.html',
    imports: [Button, Card, ConfirmDialog, IconField, InputIcon, InputText, TableModule, Toolbar],
    styleUrl: './admin-product-sub-category-list.component.scss'
})
export class AdminProductSubCategoryListComponent {
    protected productsSubCategoriesSignal = signal<ProductSubcategory[]>([]);
    protected selectedProductSubCategory = signal<ProductSubcategory | null>(null);

    productCategory!: ProductSubcategory;
    selectedProductSubcategories!: AdminProductSubCategoryListComponent[] | null;
    submitted: boolean = false;
    statuses!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    constructor(
        private productSubCategoryService: ProductSubCategoryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadProductSubcategoryData();
    }

    private loadProductSubcategoryData() {
        this.productSubCategoryService
            .getProductSubCategories()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe((data: any) => {
                this.productsSubCategoriesSignal.set(data);
                console.log(JSON.stringify(data));
            });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'ProductSubcategory ID', header: 'Code', customExportHeader: 'ProductSubcategory Code' },
            { field: 'Name', header: 'Name' },
            { field: 'GroupName', header: 'Group Name' },
            { field: 'ModifiedDate', header: 'Modified Date' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    public deleteSelectedProductSubcategories() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedProductSubcategories = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Sub category Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.submitted = false;
    }

    public deleteProductSubcategory(productCategory: ProductSubcategory) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + productCategory.productCategoryID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productCategory = {
                    productSubcategoryID: 0,
                    productCategoryID: 0,
                    name: productCategory.name,
                    modifiedDate: new Date()
                };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ProductSubcategory Deleted',
                    life: 3000
                });
            }
        });
    }

    private createId(): number {
        let id = 17;
        return ++id;
    }
}
