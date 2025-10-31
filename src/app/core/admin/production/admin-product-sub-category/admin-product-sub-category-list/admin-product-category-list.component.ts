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
import { ProductCategoryService } from '../../../../../service/product-category-service';

@Component({
    selector: 'app-admin-product-category-list',
    imports: [Button, ConfirmDialog, IconField, InputIcon, InputText, TableModule, Toolbar],
    templateUrl: './admin-product-category-list.component.html',
    styleUrl: './admin-product-category-list.component.scss'
})
export class AdminProductCategoryListComponent {
    productsCategoriesSignal = signal<ProductCategory[]>([]);
    selectedProductCategory = signal<ProductCategory | null>(null);

    productCategory!: ProductCategory;
    selectedProductCategorys!: AdminProductCategoryListComponent[] | null;
    submitted: boolean = false;
    statuses!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    constructor(
        private productCategoryService: ProductCategoryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadProductCategoryData();
    }

    loadProductCategoryData() {
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

    public deleteSelectedProductCategorys() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // this.products.set(this.products().filter((val) => !this.selectedProductCategorys?.includes(val)));
                this.selectedProductCategorys = null;
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
                // this.productCategorys.set(this.productCategorys().filter((val) => val.productCategoryID !== productCategory.productCategoryID));
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

    public saveProductCategory() {
        this.submitted = true;
        let _products = this.allProductCategorys();
        if (this.product.productID) {
            if (this.product.productID) {
                // _products[this.findIndexById(this.product.productID)] = this.product;
                this.allProductCategorys.set([..._products]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ProductCategory Updated',
                    life: 3000
                });
            } else {
                this.product.productID = this.createId();
                this.productService.addProductCategory(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ProductCategory Created',
                    life: 3000
                });
                // this.products.set([..._products, this.product]);
            }
        }
    }
}
