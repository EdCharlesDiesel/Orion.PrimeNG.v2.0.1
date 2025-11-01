import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Product } from '../../../../models/product';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import {  tap } from 'rxjs/operators';
import { ProductService } from '../../../../../service/product.service';
import { Select } from 'primeng/select';
import { FileUpload } from 'primeng/fileupload';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Checkbox } from 'primeng/checkbox';
import { NgForOf, NgIf } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Calendar } from 'primeng/calendar';
import { DropdownOption } from '../../interfaces/IDropdownOption';



@Component({
    selector: 'app-admin-product-new.',
    templateUrl: './admin-product-new.component.html',
    styleUrls: ['admin-product-new.component.scss'],
    imports: [Card, Button, ReactiveFormsModule, FormsModule, InputText, Textarea, Toast, FileUpload, InputGroup, InputGroupAddon, Checkbox, NgIf, NgForOf, DropdownModule, Calendar, Select],
    providers: [MessageService],
    standalone: true
})
export class AdminProductNewComponent implements OnInit {
    productForm!: FormGroup;
    uploadUrl: string = 'http://localhost:3000/api/images/upload-multiple';
    products = signal<Product[]>([]);
    product: Product = {
        imageUrl: '',
        modifiedDate: undefined,
        productID: 0,
        rating: undefined,
        title: '',
        name: '',
        description: '',
        productNumber: '',
        makeFlag: false,
        finishedGoodsFlag: false,
        safetyStockLevel: 0,
        reorderPoint: 0,
        size: '',
        sizeUnitMeasureCode: 's',
        weightUnitMeasureCode: 's',
        weight: 0,
        daysToManufacture: 0,
        productLine: '',
        class: 'm',
        style: 'm',
        sellStartDate: new Date(),
        sellEndDate: new Date(),
        discontinuedDate: new Date(),
        availableUntil: new Date(),
        tags: [''],
        code: 0,
        quantityInStock: 0,
        standardCost: 0,
        originalPrice: 0,
        discountPrice: 0,
        listPrice: 0,
        price: 0,
        discountPercentage: 0,
        inventoryStatus: null,
        isFeatured: false,
        isNew: false,
        color: '#000000'
    };

    categories: DropdownOption[] = [
        { name: 'Bikes', value: 'bikes' },
        { name: 'Components', value: 'components' },
        { name: 'Clothing', value: 'clothing' },
        { name: 'Accessories', value: 'accessories' }
    ];

    classes: DropdownOption[] = [
        { name: 'High', value: 'high' },
        { name: 'Medium', value: 'medium' },
        { name: 'Low', value: 'low' }
    ];

    sizes: DropdownOption[] = [
        { name: 'S', value: 's' },
        { name: 'M', value: 'm' },
        { name: 'L', value: 'l' }
    ];

    styles: DropdownOption[] = [
        { name: 'Modern', value: 'modern' },
        { name: 'Classic', value: 'classic' },
        { name: 'Vintage', value: 'vintage' }
    ];

    subcategories: DropdownOption[] = [
        { name: 'Subcategory 1', value: 'sub1' },
        { name: 'Subcategory 2', value: 'sub2' },
        { name: 'Subcategory 3', value: 'sub3' }
    ];

    inventoryStatuses: DropdownOption[] = [
        { name: 'In Stock', value: 'in-stock' },
        { name: 'Low Stock', value: 'low-stock' },
        { name: 'Out of Stock', value: 'out-of-stock' }
    ];

    colors: DropdownOption[] = [
        { name: 'Red', value: 'red' },
        { name: 'White', value: 'white' },
        { name: 'Black', value: 'black' }
    ];

    private submitted: boolean | undefined;
    private loading: boolean | undefined;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private productService: ProductService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.loadProductsFromDatabase();
    }

    initializeForm(): void {
        this.productForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(2)]],
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', [Validators.required, Validators.minLength(2)]],
            productNumber: ['', [Validators.required, Validators.minLength(2)]],
            makeFlag: [0],
            finishedGoodsFlag: [0],
            safetyStockLevel: [0],
            reorderPoint: [0],
            size: [0],
            sizeUnitMeasureCode: [0],
            weightUnitMeasureCode: [0],
            weight: [0],
            daysToManufacture: [0],
            productLine: [''],
            class: [''],
            style: [''],
            productSubcategory: [null],
            sellStartDate: [null],
            sellEndDate: [null],
            discontinuedDate: [null],
            availableUntil: [null],
            tags: [''],
            code: [''],
            quantityInStock: 0,
            standardCost: 0,
            originalPrice: 0,
            discountPrice: 0,
            listPrice: 0,
            price: 0,
            discountPercentage: 0,
            inventoryStatus: [null],
            isFeatured: false,
            isNew: false,
            color: ''
        });
    }

    get productFormControls() {
        return this.productForm.controls;
    }
    public saveProduct(): void {
        this.submitted = true;

        if (this.productForm.invalid) {
            this.markFormGroupTouched(this.productForm);
            return;
        }

        this.loading = true;

        const productData: Product = {
            productID: this.getPrimaryKey(),
            title: this.productFormControls['title'].value,
            name: this.productFormControls['name'].value,
            color: this.productFormControls['color'].value,
            availableUntil: this.productFormControls['availableUntil'].value,
            code: this.productFormControls['code'].value,
            daysToManufacture: this.productFormControls['daysToManufacture'].value,
            discountPercentage: this.productFormControls['discountPercentage'].value,
            discountPrice: this.productFormControls['discountPrice'].value,
            imageUrl: '',
            inventoryStatus: this.productFormControls['inventoryStatus'].value,
            isFeatured: this.productFormControls['isFeatured'].value,
            isNew: this.productFormControls['isNew'].value,
            listPrice: this.productFormControls['listPrice'].value,
            modifiedDate: new Date(),
            originalPrice: this.productFormControls['price'].value,
            price: this.productFormControls['price'].value,
            productNumber: this.productFormControls['productNumber'].value,
            quantityInStock: this.productFormControls['quantityInStock'].value,
            reorderPoint: this.productFormControls['reorderPoint'].value,
            sellStartDate: this.productFormControls['sellStartDate'].value,
            sellEndDate: this.productFormControls['sellEndDate'].value,
            standardCost: this.productFormControls['standardCost'].value,
            tags: this.productFormControls['tags'].value,
            description: this.productFormControls['description'].value,
            safetyStockLevel: this.productFormControls['safetyStockLevel'].value,
            makeFlag: this.productFormControls['makeFlag'].value,
            finishedGoodsFlag: this.productFormControls['finishedGoodsFlag'].value,
            size: this.productFormControls['size'].value,
            sizeUnitMeasureCode: this.productFormControls['sizeUnitMeasureCode'].value,
            weightUnitMeasureCode: this.productFormControls['weightUnitMeasureCode'].value,
            productLine: this.productFormControls['productLine'].value,
            class: this.productFormControls['class'].value,
            style: this.productFormControls['style'].value
        };

        this.productService
            .addProduct(productData)
            .pipe(tap(() => console.log('Product added', productData)))
            .subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Adding Product Successful',
                        detail: `Adding Product Successful!`
                    });
                },
                error: (error: any) => {
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error Saving Product',
                        detail: `Error adding Product`
                    });
                },
                complete: () => {
                    this.loading = false;
                }
            });

        this.onCancel();
    }

    clearForm(): void {
        this.productForm.reset();
        this.product = {
            availableUntil: undefined,
            code: undefined,
            daysToManufacture: undefined,
            description: undefined,
            discountPercentage: undefined,
            discountPrice: undefined,
            finishedGoodsFlag: undefined,
            imageUrl: '',
            inventoryStatus: undefined,
            isFeatured: false,
            isNew: undefined,
            listPrice: undefined,
            makeFlag: undefined,
            modifiedDate: undefined,
            originalPrice: undefined,
            price: 0,
            productID: 0,
            productNumber: undefined,
            quantityInStock: 0,
            rating: undefined,
            reorderPoint: undefined,
            safetyStockLevel: 0,
            sellStartDate: undefined,
            standardCost: undefined,
            tags: undefined,
            title: '',
            name: ''
        };
    }
    onCancel(): void {
        this.productForm.reset();
        this.product = {
            availableUntil: undefined,
            code: undefined,
            daysToManufacture: undefined,
            description: undefined,
            discountPercentage: undefined,
            discountPrice: undefined,
            finishedGoodsFlag: undefined,
            imageUrl: '',
            inventoryStatus: undefined,
            isFeatured: false,
            isNew: undefined,
            listPrice: undefined,
            makeFlag: undefined,
            modifiedDate: undefined,
            originalPrice: undefined,
            price: 0,
            productID: 0,
            productNumber: undefined,
            quantityInStock: 0,
            rating: undefined,
            reorderPoint: undefined,
            safetyStockLevel: 0,
            sellStartDate: undefined,
            standardCost: undefined,
            tags: undefined,
            title: '',
            name: ''
        };
        this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Product creation cancelled'
        });
    }

    bulkInsert(): void {
        console.log('Bulk insert clicked');
        this.messageService.add({
            severity: 'info',
            summary: 'Bulk Import',
            detail: 'Bulk import functionality triggered'
        });
    }

    importProduct(): void {
        console.log('import selected clicked');
        this.messageService.add({
            severity: 'info',
            summary: 'import',
            detail: 'import functionality triggered'
        });
    }

    onUpload(event: any): void {
        console.log('Files uploaded:', event);
        this.messageService.add({
            severity: 'success',
            summary: 'Upload Success',
            detail: 'Files uploaded successfully'
        });
    }

    public onSelect(event: any): void {
        console.log('Files selected:', event);
    }

    public isFieldInvalid(fieldName: string): boolean {
        const field = this.productForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
    }

    public getFieldError(fieldName: string): string {
        const field = this.productForm.get(fieldName);
        if (field?.errors && (field.dirty || field.touched || this.submitted)) {
            if (field.errors['name']) return `${this.getFieldDisplayName(fieldName)} is required`;
            if (field.errors['title']) return `${this.getFieldDisplayName(fieldName)} is required`;
            if (field.errors['minlength']) return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
        }
        return '';
    }

    private getFieldDisplayName(fieldName: string): string {
        const displayNames: { [key: string]: string } = {
            name: 'name',
            title: 'title'
        };
        return displayNames[fieldName] || fieldName;
    }
    private getPrimaryKey(): number {
        let key = this.products().length;
        return key + 1;
    }

    private loadProductsFromDatabase() {
        this.productService
            .getProducts()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe({
                next: (data) => {
                    this.products.set(data);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Connection failed.',
                        detail: 'Connection failed. please check your internet connection.'
                    });
                }
            });
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            control?.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }
}
