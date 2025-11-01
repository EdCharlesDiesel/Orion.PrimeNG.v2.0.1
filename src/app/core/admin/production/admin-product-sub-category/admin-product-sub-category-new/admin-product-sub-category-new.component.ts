import { Component, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { ProductSubcategory } from '../../../../models/product-subcategory.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { tap } from 'rxjs/operators';
import { ProductSubCategoryService } from '../../../services/product-sub-category-service';

@Component({
    selector: 'app-admin-product-sub-category-new',
    imports: [Button, Card, InputText, ReactiveFormsModule, Toast],
    templateUrl: './admin-product-sub-category-new.component.html',
    styleUrl: './admin-product-sub-category-new.component.scss',
    providers:[ConfirmationService,MessageService ]
})
export class AdminProductSubCategoryNewComponent implements OnInit {
    productSubCategoryForm!: FormGroup;
    productSubCategoriesSignal = signal<ProductSubcategory[]>([]);
    productSubCategory: ProductSubcategory = {
        productCategoryID: 0,
        productSubcategoryID: 0,
        name: '',
        modifiedDate: new Date()
    };

    private submitted: boolean | undefined;
    private loading: boolean | undefined;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private productSubCategoryService: ProductSubCategoryService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.loadProductSubCategoriesFromDatabase();
    }

    initializeForm(): void {
        this.productSubCategoryForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            productCategory: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
        });
    }

    get productSubCategoryFormControls() {
        return this.productSubCategoryForm.controls;
    }
    public saveProductSubCategory(): void {
        this.submitted = true;

        if (this.productSubCategoryForm.invalid) {
            this.markFormGroupTouched(this.productSubCategoryForm);
            return;
        }

        this.loading = true;

        const productSubCategoryData: ProductSubcategory = {
            productCategoryID: 0,
            productSubcategoryID: this.getPrimaryKey(),
            name: this.productSubCategoryFormControls['name'].value,
            modifiedDate: new Date()
        };

        this.productSubCategoryService
            .createProductSubCategory(productSubCategoryData)
            .pipe(tap(() => console.log('Product Sub Category added', productSubCategoryData)))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Adding Product Category Successful',
                        detail: `Adding Product Category Successful!`
                    });
                },
                error: () => {
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error Saving Product Category',
                        detail: `Error adding Product Category`
                    });
                },
                complete: () => {
                    this.loading = false;
                }
            });

        this.onCancel();
    }

    public clearForm(): void {
        this.productSubCategoryForm.reset();
        this.productSubCategory = {
            productCategoryID: 0,
            productSubcategoryID: 0,
            name: '',
            modifiedDate: new Date()
        };
    }
    public onCancel(): void {
        this.productSubCategoryForm.reset();
        this.productSubCategory = {
            productCategoryID: 0,
            productSubcategoryID: 0,
            name: '',
            modifiedDate: new Date()
        };
        this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Product Category creation cancelled'
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

    importProductCategory(): void {
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
        const field = this.productSubCategoryForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
    }

    public getFieldError(fieldName: string): string {
        const field = this.productSubCategoryForm.get(fieldName);
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
        };
        return displayNames[fieldName] || fieldName;
    }
    private getPrimaryKey(): number {
        let key = this.productSubCategoriesSignal().length;
        return key + 1;
    }

    private loadProductSubCategoriesFromDatabase() {
        this.productSubCategoryService
            .getProductSubCategories()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe({
                next: (data) => {
                    this.productSubCategoriesSignal.set(data);
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
