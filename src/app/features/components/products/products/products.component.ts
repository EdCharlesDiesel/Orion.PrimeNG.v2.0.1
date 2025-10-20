import { Toast } from 'primeng/toast';
import { Product } from '../../../../core/models/product';
import { Store } from '@ngrx/store';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../../../service/cart.service';
import { Router } from '@angular/router';
import { selectProductsViewModel } from '../../../../store/products/product.selectors';
import * as ProductActions from '../../../../store/products/product.actions';
import * as CartActions from '../../../../store/cart/cart.actions';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Card } from 'primeng/card';
import { AsyncPipe, CommonModule, CurrencyPipe, NgClass, SlicePipe } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ButtonDirective } from 'primeng/button';
@Component({
    selector: 'app-product',
    standalone: true,
    templateUrl: 'products.component.html',
    imports: [Card, NgClass, ProgressSpinner, CurrencyPipe, SlicePipe, ButtonDirective, AsyncPipe, CommonModule, PrimeTemplate],
    styleUrl: 'products.component.scss'
})
export class ProductsComponent implements OnInit {
    private readonly store = inject(Store);
    private cartService = inject(CartService);
    private readonly router = inject(Router);
    constructor(private messageService: MessageService) {}
    // Single view model observable
    vm$ = this.store.select(selectProductsViewModel);

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.store.dispatch(ProductActions.loadProducts());
    }

    public addToCart(product: Product): void {
        if ((product.quantityInStock ?? 0) > 0) {
            // Dispatch to cart
            this.store.dispatch(CartActions.addToCart({ product, quantity: 1 }));

            // Decrement product stock
            this.store.dispatch(
                ProductActions.decrementProductQuantity({
                    id: product.productID,
                    amount: 1
                })
            );

            this.messageService.add({
                severity: 'success', // success | info | warn | error
                summary: 'Added to Cart', // title
                detail: `${product.title} added to cart!`, // message
                life: 3000 // duration in milliseconds
            });
        } else {
            // Show out-of-stock snackbar
            this.messageService.add({
                severity: 'success', // success | info | warn | error
                summary: 'Added to Cart', // title
                detail: `${product.title} added to cart!`, // message
                life: 3000 // duration in milliseconds
            });
        }
    }

    removeProductNow(id: number): void {
        if (confirm('Are you sure you want to remove this product?')) {
            this.store.dispatch(ProductActions.deleteProduct({ id }));
        }
    }

    updateQuantity(id: number, quantity: number): void {
        this.store.dispatch(ProductActions.updateProductQuantity({ id, quantity }));
    }

    isOutOfStock(product: Product): boolean {
        return (product.quantityInStock ?? 0) === 0;
    }

    isLowStock(product: Product): boolean {
        const quantity = product.quantityInStock ?? 0;
        return quantity > 0 && quantity <= 5;
    }

    trackByProductId(index: number, product: Product): number {
        return product.productID;
    }
}
