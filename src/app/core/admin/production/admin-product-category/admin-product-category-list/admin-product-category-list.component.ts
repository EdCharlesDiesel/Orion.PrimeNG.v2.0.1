import { Component, computed, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ProductCategory } from '../../../../models/product-category.model';
import { Column } from '../../../../models/Column';
import { ProductCategoryService } from '../../../services/product-category-service';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-admin-product-category-list',
    imports: [Button, ConfirmDialog, IconField, InputIcon, InputText, TableModule, Toolbar, Card],
    templateUrl: './admin-product-category-list.component.html',
    styleUrl: './admin-product-category-list.component.scss'
})
export class AdminProductCategoryListComponent {
    protected productsCategoriesSignal = signal<ProductCategory[]>([]);
    protected selectedProductCategory = signal<ProductCategory | null>(null);

    productCategory!: ProductCategory;
    selectedProductCategories!: AdminProductCategoryListComponent[] | null;
    submitted: boolean = false;
    statuses!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    constructor(
        private productCategoryService: ProductCategoryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadProductCategoryData();
    }

    public loadProductCategoryData() {
        this.productCategoryService
            .getProductCategories()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe((data: any) => {
                this.productsCategoriesSignal.set(data);
                console.log(JSON.stringify(data));
            });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'ProductCategory ID', header: 'Code', customExportHeader: 'ProductCategory Code' },
            { field: 'Name', header: 'Name' },
            { field: 'GroupName', header: 'Group Name' },
            { field: 'ModifiedDate', header: 'Modified Date' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    public deleteSelectedProductCategories() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedProductCategories = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ProductCategorys Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.submitted = false;
    }

    public deleteProductCategory(productCategory: ProductCategory) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + productCategory.productCategoryID + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productCategory = {
                    productCategoryID: 0,
                    name: productCategory.name,
                    modifiedDate: new Date()
                };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ProductCategory Deleted',
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
