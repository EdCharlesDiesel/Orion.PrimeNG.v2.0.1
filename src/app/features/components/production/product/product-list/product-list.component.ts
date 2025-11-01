import { Component, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { AsyncPipe, NgIf } from '@angular/common';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Store } from '@ngrx/store';
import { CartService } from '../../../../../service/cart.service';
import { Router } from '@angular/router';
import { selectProductsViewModel } from '../../../../../store/products/product.selectors';
import { Product } from '../../../../../core/models/product';
import * as ProductActions from '../../../../../store/products/product.actions';
import { addToCart } from '../../../../../store/cart/cart.actions';
import { loadProductsSuccess } from '../../../../../store/products/product.actions';

@Component({
    selector: 'app-product-list',
    standalone: true,

    templateUrl: './product-list.component.html',
    imports: [Card, FormsModule, Message, PrimeTemplate, Paginator, AsyncPipe, NgIf],
    styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
    private readonly store = inject(Store);
    private readonly cartService = inject(CartService);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);
    errorMessage = signal('');
    pageTitle = 'Product List';
    selectedProductId?: number;
    vm$ = this.store.select(selectProductsViewModel);

    rows = 8;
    first = 0;
    paginatedProducts: Product[] = [];
    wishlist: Product[] = [];

    onSelected(productId: number) {
        this.selectedProductId = productId;
    }

    ngOnInit(): void {
        this.loadProducts();
        this.vm$.subscribe((vm) => {
            if (vm && vm.products) {
                this.paginatedProducts = vm.products.slice(this.first, this.first + this.rows);
            }
        });
    }

    loadProducts(): void {
        this.store.dispatch(ProductActions.loadProducts());
    }

    onPageChange(event: any): void {
        this.first = event.first;
        const start = event.first;
        const end = event.first + event.rows;

        this.vm$.subscribe((vm) => {
            this.paginatedProducts = vm.products.slice(start, end);
        });
    }

    isOutOfStock(product: Product) {}

    isLowStock(product: Product) {}

    protected readonly addToCart = addToCart;

    addToWishlist(product: Product) {}

    protected readonly loadProductsSuccess = loadProductsSuccess;
}
