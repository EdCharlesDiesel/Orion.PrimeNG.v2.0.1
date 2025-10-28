// products.component.ts
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

interface Product {
    productID: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
    quantityInStock: number;
}

interface ProductsViewModel {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    totalInventory: number;
}

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        PaginatorModule,
        ProgressSpinner
    ]
})
export class ProductsComponent implements OnInit {
    private messageService = inject(MessageService);

    // Pagination
    first = signal(0);
    rows = signal(9);

    // View Model
    private productsSubject = new BehaviorSubject<Product[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private errorSubject = new BehaviorSubject<string | null>(null);

    vm$: Observable<ProductsViewModel> = combineLatest([
        this.productsSubject.asObservable(),
        this.loadingSubject.asObservable(),
        this.errorSubject.asObservable()
    ]).pipe(
        map(([products, isLoading, error]) => ({
            products,
            isLoading,
            error,
            totalInventory: this.calculateTotalInventory(products)
        }))
    );

    // Computed signals for pagination
    paginatedProducts = computed(() => {
        const vm = this.productsSubject.value;
        const first = this.first();
        const rows = this.rows();
        return vm.slice(first, first + rows);
    });

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);

        // Simulate API call - replace with actual service call
        setTimeout(() => {
            try {
                // Sample data - replace with actual API response
                const sampleProducts: Product[] = [
                    {
                        productID: 1,
                        title: "Fjallraven - Foldsack No. 1 Backpack",
                        price: 109.95,
                        description: "Your perfect pack for everyday use and walks in the forest.",
                        category: "men's clothing",
                        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                        rating: { rate: 3.9, count: 120 },
                        quantityInStock: 15
                    },
                    {
                        productID: 2,
                        title: "Mens Casual Premium Slim Fit T-Shirts",
                        price: 22.3,
                        description: "Slim-fitting style, contrast raglan long sleeve.",
                        category: "men's clothing",
                        image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
                        rating: { rate: 4.1, count: 259 },
                        quantityInStock: 0
                    },
                    {
                        productID: 3,
                        title: "Mens Cotton Jacket",
                        price: 55.99,
                        description: "Great outerwear jackets for Spring/Autumn/Winter.",
                        category: "men's clothing",
                        image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
                        rating: { rate: 4.7, count: 500 },
                        quantityInStock: 3
                    }
                    // Add more sample products as needed
                ];

                this.productsSubject.next(sampleProducts);
                this.loadingSubject.next(false);
            } catch (error) {
                this.errorSubject.next('Failed to load products. Please try again.');
                this.loadingSubject.next(false);
            }
        }, 1500);
    }

    onPageChange(event: any) {
        this.first.set(event.first);
        this.rows.set(event.rows);
    }

    isOutOfStock(product: Product): boolean {
        return product.quantityInStock === 0;
    }

    isLowStock(product: Product): boolean {
        return product.quantityInStock > 0 && product.quantityInStock <= 5;
    }

    addToCart(product: Product) {
        if (this.isOutOfStock(product)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Out of Stock',
                detail: `${product.title} is currently out of stock`
            });
            return;
        }

        this.messageService.add({
            severity: 'success',
            summary: 'Added to Cart',
            detail: `${product.title} has been added to your cart`
        });
    }

    addToWishlist(product: Product) {
        this.messageService.add({
            severity: 'info',
            summary: 'Added to Wishlist',
            detail: `${product.title} has been added to your wishlist`
        });
    }

    private calculateTotalInventory(products: Product[]): number {
        return products.reduce((total, product) => total + product.quantityInStock, 0);
    }
}
