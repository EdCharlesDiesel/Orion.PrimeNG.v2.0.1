import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../../service/product.service';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss'],
    providers: [MessageService]
})
export class ProductNewComponent implements OnInit {

    product: Product = this.createEmptyProduct();

    categories = [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Jewelery', value: 'jewelery' },
        { label: "Men's Clothing", value: "men's clothing" },
        { label: "Women's Clothing", value: "women's clothing" }
    ];

    constructor(
        private readonly productService: ProductService,
        private readonly messageService: MessageService
    ) {}

    ngOnInit(): void {}

    /**
     * Initializes an empty product object.
     */
    private createEmptyProduct(): Product {
        return {
            id: 0,
            title: '',
            price: 0,
            description: '',
            image: '',
            category: '',
            rating: { rate: 0, count: 0 }
        };
    }

    /**
     * Handles the Add Product submission.
     */
    addProduct(): void {
        if (!this.isProductValid(this.product)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Please fill in all required fields.'
            });
            return;
        }

        this.productService.addProduct(this.product).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Product Added',
                    detail: `Product "${this.product.title}" has been added successfully.`
                });
                console.log('Product added:', response);
                this.resetForm();
            },
            error: (err) => {
                console.error('Error adding product:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to add product. Please try again.'
                });
            }
        });
    }

    /**
     * Validates that the required product fields are filled.
     */
    private isProductValid(product: Product): boolean {
        return !!product.title && !!product.price && !!product.category;
    }

    /**
     * Resets the form to its default state.
     */
    private resetForm(): void {
        this.product = this.createEmptyProduct();
    }
}




export interface Rating {
    rate: number;
    count: number;
}

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
    rating: Rating;
}
