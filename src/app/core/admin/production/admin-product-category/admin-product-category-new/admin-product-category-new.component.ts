import { Component, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { ProductCategory } from '../../../../models/product-category.model';
import { MessageService } from 'primeng/api';
import { ProductCategoryService } from '../../../services/product-category-service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-admin-product-category-new',
    imports: [Button, Card, InputText, ReactiveFormsModule, Toast],
    templateUrl: './admin-product-category-new.component.html',
    styleUrl: './admin-product-category-new.component.scss'
})
export class AdminProductCategoryNewComponent {
    productCategoryForm!: FormGroup;
    productCategorySignal = signal<ProductCategory[]>([]);
    productCategory: ProductCategory = {
        productCategoryID: 0,
        name: '',
        modifiedDate: new Date()
    };

    private submitted: boolean | undefined;
    private loading: boolean | undefined;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private productCategoryService: ProductCategoryService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.loadProductCategoriesFromDatabase();
    }

    initializeForm(): void {
        this.productCategoryForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
        });
    }

    get productCategoryFormControls() {
        return this.productCategoryForm.controls;
    }
    public saveProductCategory(): void {
        this.submitted = true;

        if (this.productCategoryForm.invalid) {
            this.markFormGroupTouched(this.productCategoryForm);
            return;
        }

        this.loading = true;

        const productData: ProductCategory = {
            productCategoryID: this.getPrimaryKey(),
            name: this.productCategoryFormControls['name'].value,
            modifiedDate: new Date()
        };

        this.productCategoryService
            .createProductCategory(productData)
            .pipe(tap(() => console.log('Product Category added', productData)))
            .subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Adding Product Category Successful',
                        detail: `Adding Product Category Successful!`
                    });
                },
                error: (error: any) => {
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
        this.productCategoryForm.reset();
        this.productCategory = {
            productCategoryID: 0,
            name: '',
            modifiedDate: new Date(),
            productSubcategories: []
        };
    }
    public onCancel(): void {
        this.productCategoryForm.reset();
        this.productCategory = {
            productCategoryID: 0,
            name: '',
            modifiedDate: new Date(),
            productSubcategories: []
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
        const field = this.productCategoryForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
    }

    public getFieldError(fieldName: string): string {
        const field = this.productCategoryForm.get(fieldName);
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
        let key = this.productCategorySignal().length;
        return key + 1;
    }

    private loadProductCategoriesFromDatabase() {
        this.productCategoryService
            .getProductCategories()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe({
                next: (data) => {
                    this.productCategorySignal.set(data);
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
