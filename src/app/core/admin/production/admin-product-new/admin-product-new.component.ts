import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Product } from '../../../models/product';

interface DropdownOption {
    name: string;
    value: string;
}

@Component({
    selector: 'app-new-product',
    templateUrl: './',
    styleUrls: ['./new-product.component.scss'],
    providers: [MessageService]
})
export class NewProductComponent implements OnInit {
    productForm!: FormGroup;
    sliderValue: number = 0;
    uploadUrl: string = 'http://localhost:3000/api/images/upload-multiple';

    product: Product = {
        imageUrl: '',
        modifiedDate: undefined,
        productID: 0,
        title: '',
        name: '',
        description: '',
        productNumber: '',
        makeFlag: true,
        finishedGoodsFlag: true,
        safetyStockLevel: 0,
        reorderPoint: 0,
        size: '',
        sizeUnitMeasureCode: "0",
        weightUnitMeasureCode: "m",
        weight: 0,
        daysToManufacture: 0,
        productLine: '',
        class: 'm',
        style: 'm',
        sellStartDate:new Date,
        sellEndDate: new Date,
        discontinuedDate: new Date,
        availableUntil: new Date,
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
        { name: 'Electronics', value: 'electronics' },
        { name: 'Fashion', value: 'fashion' },
        { name: 'Beauty', value: 'beauty' },
        { name: 'Sports', value: 'sports' },
        { name: 'Home & Kitchen', value: 'home' }
    ];

    classes: DropdownOption[] = [
        { name: 'High', value: 'high' },
        { name: 'Medium', value: 'medium' },
        { name: 'Low', value: 'low' }
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
        { name: 'In Stock', value: 'instock' },
        { name: 'Low Stock', value: 'lowstock' },
        { name: 'Out of Stock', value: 'outofstock' }
    ];

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm(): void {
        this.productForm = this.fb.group({
            title: ['', Validators.required],
            name: ['', Validators.required],
            description: [''],
            category: [null],
            productNumber: [''],
            makeFlag: [''],
            finishedGoodsFlag: [''],
            safetyStockLevel: [0],
            reorderPoint: [0],
            size: [''],
            sizeUnitMeasureCode: [0],
            weightUnitMeasureCode: [0],
            weight: [0],
            daysToManufacture: [0],
            productLine: [''],
            class: [null],
            style: [null],
            productSubcategory: [null],
            sellStartDate: [null],
            sellEndDate: [null],
            discontinuedDate: [null],
            availableUntil: [null],
            tags: [''],
            code: [0],
            quantityInStock: [0],
            standardCost: [0],
            originalPrice: [0],
            discountPrice: [0],
            listPrice: [0],
            price: [0],
            discountPercentage: [0],
            inventoryStatus: [null],
            featured: [false],
            new: [false],
            color: ['#000000'],
        });
    }

    saveProduct(): void {
        if (this.productForm.valid) {
            console.log('Product Data:', this.product);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product saved successfully'
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields'
            });
        }
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

    exportSelected(): void {
        console.log('Export selected clicked');
        this.messageService.add({
            severity: 'info',
            summary: 'Export',
            detail: 'Export functionality triggered'
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

    onSelect(event: any): void {
        console.log('Files selected:', event);
    }
}
