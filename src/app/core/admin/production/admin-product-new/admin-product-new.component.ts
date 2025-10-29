import { MessageService} from 'primeng/api';
import { Component,  OnInit } from '@angular/core';
import { Fluid } from 'primeng/fluid';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FloatLabel } from 'primeng/floatlabel';
import { Textarea } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';
import { Slider } from 'primeng/slider';
import { Rating } from 'primeng/rating';
import { Knob } from 'primeng/knob';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Listbox } from 'primeng/listbox';
import { Select } from 'primeng/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../authentication/services/auth.service';
import { Router } from '@angular/router';
import { ProductService } from '../../../../service/product.service';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { UIChart } from 'primeng/chart';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputNumber } from 'primeng/inputnumber';
import { ColorPicker } from 'primeng/colorpicker';
import {
    ImageUploadAdvancedComponent
} from '../../../../features/components/files/image-upload-advanced/image-upload-advanced.component';
import { FileSelectEvent, FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { Toast } from 'primeng/toast';


@Component({
    selector: 'app-admin-product-new',
    templateUrl: './admin-product-new.component.html',
    styleUrls: ['./admin-product-new.component.scss'],
    imports: [
        InputText,
        Textarea,
        Button,
        Card,
        DatePicker,
        FormsModule,
        Tab,
        TabList,
        TabPanel,
        TabPanels,
        TableModule,
        Tabs,
        InputGroup,
        InputGroupAddon,
        Checkbox,
        ColorPicker,
        FileUpload,
        NgForOf,
        NgIf,
        Select,
        Slider,
        Toast,
        ReactiveFormsModule
    ],
    providers: [MessageService]
})
class AdminProductNewComponent implements OnInit {
    productForm: FormGroup;
    loading = false;
    submitted = false;
    passwordVisible = false;
    confirmPasswordVisible = false;

    colorValue: string = '#1976D2';
    calendarValue: any = null;
    dropdownValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    dropdownValue: any = null;
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private productService: ProductService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.productForm = this.formBuilder.group(
            {
                title: ['', Validators.required],
                name: ['', Validators.required],
                description: ['', Validators.required],
                category: ['', Validators.required],
                price: ['', Validators.required],
                productNumber: ['', Validators.required],
                makeFlag: ['', Validators.required],
                finishedGoodsFlag: ['', Validators.required],
                color: ['', Validators.required],
                safetyStockLevel: ['', Validators.required],
                reorderPoint: ['', Validators.required],
                standardCost: ['', Validators.required],
                listPrice: ['', Validators.required],
                size: ['', Validators.required],
                sizeUnitMeasureCode: ['', Validators.required],
                weightUnitMeasureCode: ['', Validators.required],
                weight: ['', Validators.required],
                daysToManufacture: ['', Validators.required],
                productLine: ['', Validators.required],
                class: ['', Validators.required],
                style: ['', Validators.required],
                productSubcategoryID: ['', [Validators.required, Validators.minLength(2)]],
                productModelID: ['', [Validators.required]],
                sellStartDate: ['', [Validators.required]],
                sellEndDate: ['', Validators.required],
                discontinuedDate: [false, Validators.requiredTrue],
                imageUrl: ['', Validators.required],
                availableUntil: ['', Validators.required],
                tags: ['', Validators.required],
                isNew: ['', Validators.required],
                code: ['', Validators.required],
                quantityInStock: ['', Validators.required],
                originalPrice: ['', Validators.required],
                discountPrice: ['', Validators.required],
                discountPercentage: ['', Validators.required],
                productProductPhotos: ['', Validators.required],
                inventoryStatus: ['', Validators.required],
                modifiedDate: ['', Validators.required],
                isFeatured: ['', Validators.required]
            },
            {
                validators: this.passwordMatchValidator
            }
        );
    }

    ngOnInit(): void {
        // // if (!this.authService.isAuthenticated()) {
        //     this.router.navigate(['/login']);
        // }
    }

    // Custom validator for password match
    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }

        if (confirmPassword?.hasError('passwordMismatch')) {
            delete confirmPassword.errors!['passwordMismatch'];
            confirmPassword.updateValueAndValidity({ emitEvent: false });
        }

        return null;
    }

    get productFormControls() {
        return this.productForm.controls;
    }

    public onSubmit(): void {
        this.submitted = true;

        // if (this.productForm.invalid) {
        //     this.markFormGroupTouched();
        //     this.messageService.add({
        //         severity: 'error',
        //         summary: 'Adding Product Failed',
        //         detail: 'An error occurred during submissionplease check all the data.'
        //     });
        //     return;
        // }

        this.loading = true;

        let productData: any = {
            title: this.productFormControls['title'].value.trim(),
            name: this.productFormControls['name'].value.trim().toLowerCase(),
            description: this.productFormControls['description'].value,

            category: this.productFormControls['category'].value,
            price: this.productFormControls['price'].value,
            productNumber: this.productFormControls['productNumber'].value,
            makeFlag: this.productFormControls['makeFlag'].value,
            finishedGoodsFlag: this.productFormControls['finishedGoodsFlag'].value,
            color: this.productFormControls['color'].value,
            safetyStockLevel: this.productFormControls['safetyStockLevel'].value,
            reorderPoint: this.productFormControls['reorderPoint'].value,
            standardCost: this.productFormControls['standardCost'].value,
            listPrice: this.productFormControls['listPrice'].value,
            size: this.productFormControls['size'].value,
            sizeUnitMeasureCode: this.productFormControls['sizeUnitMeasureCode'].value,
            weightUnitMeasureCode: this.productFormControls['weightUnitMeasureCode'].value,
            weight: this.productFormControls['weight'].value,
            daysToManufacture: this.productFormControls['daysToManufacture'].value,
            productLine: this.productFormControls['description'].value,
            class: this.productFormControls['description'].value,
            style: this.productFormControls['description'].value,
            productSubcategoryID: this.productFormControls['productSubcategoryID'].value,
            productModelID:  this.productFormControls['productModelID'].value,
            sellStartDate:  this.productFormControls['sellStartDate'].value,
            sellEndDate: this.productFormControls['description'].value,
            discontinuedDate: this.productFormControls['discontinuedDate'].value,
            imageUrl: this.productFormControls['imageUrl'].value,
            availableUntil: this.productFormControls['availableUntil'].value,
            tags: this.productFormControls['tags'].value,
            isNew: this.productFormControls['isNew'].value,
            code: this.productFormControls['code'].value,
            quantityInStock: this.productFormControls['quantityInStock'].value,
            originalPrice: this.productFormControls['originalPrice'].value,
            discountPrice: this.productFormControls['discountPrice'].value,
            discountPercentage: this.productFormControls['discountPercentage'].value,
            productProductPhotos: this.productFormControls['productProductPhotos'].value,
            inventoryStatus: this.productFormControls['inventoryStatus'].value,
            modifiedDate: this.productFormControls['modifiedDate'].value,
            isFeatured: this.productFormControls['isFeatured'].value,
        };

        this.productService.addProduct(productData).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Product add Successful',
                    detail: 'Your account has been created successfully!'
                });
            },
            error: (error: any) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Registration Failed',
                    detail: error || 'An error occurred during registration'
                });
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    togglePasswordVisibility(): void {
        this.passwordVisible = !this.passwordVisible;
    }

    toggleConfirmPasswordVisibility(): void {
        this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }

    navigateToLogin(): void {
        this.router.navigate(['/auth/login']);
    }

    private markFormGroupTouched(): void {
        Object.keys(this.productForm.controls).forEach((key) => {
            const control = this.productForm.get(key);
            control?.markAsTouched();
        });
    }
    isFieldInvalid(fieldName: string): boolean {
        const field = this.productForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
    }

    getFieldError(fieldName: string): string {
        const field = this.productForm.get(fieldName);
        if (field?.errors && (field.dirty || field.touched || this.submitted)) {
            if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
            if (field.errors['email']) return 'Please enter a valid email address';
            if (field.errors['minlength']) return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
            if (field.errors['pattern']) return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
            if (field.errors['passwordMismatch']) return 'Passwords do not match';
        }
        return '';
    }

    private getFieldDisplayName(fieldName: string): string {
        const displayNames: { [key: string]: string } = {
            name: 'Name',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password'
        };
        return displayNames[fieldName] || fieldName;
    }

    autoValue: any[] | undefined;
    autoFilteredValue: any[] = [];
    sliderValue: number = 50;

    exportSelected() {}

    clearFilters() {}

    bulkInsert() {}

    onUpload($event: FileUploadEvent) {}

    onSelect($event: FileSelectEvent) {}

    protected readonly oncancel = oncancel;
}

export default AdminProductNewComponent;
