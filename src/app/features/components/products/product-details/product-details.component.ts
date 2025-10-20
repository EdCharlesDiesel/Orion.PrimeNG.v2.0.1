import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../product-new/product-new.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../service/product.service';
import { Card } from 'primeng/card';
import { NgIf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';


@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
    imports: [Card, NgIf, PrimeTemplate, ButtonDirective]
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
    selectedProduct?: Product;
    private routeSub?: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private productService: ProductService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // ✅ Subscribe to route params safely
        this.routeSub = this.activatedRoute.params.subscribe({
            next: (params) => {
                const id = params['id'];
                if (id) {
                    this.loadProduct(id);
                }
            }
        });
    }

    private loadProduct(id: any): void {
        this.productService.getProductById(id).subscribe({
            next: (result: any) => {
                this.selectedProduct = result;
            },
            error: (err) => {
                console.error('Error loading product:', err);
            }
        });
    }

    onBack(): void {
        // ✅ Navigate back to product list or previous page
        this.router.navigate(['/products']);
    }

    onBuy(product: Product): void {
        // ✅ Example: navigate to checkout or trigger service call
        console.log('Buying product:', product);
        this.router.navigate(['/checkout'], {
            queryParams: { productId: product.id }
        });
    }

    ngOnDestroy(): void {
        // ✅ Clean up subscriptions to prevent memory leaks
        this.routeSub?.unsubscribe();
    }
}
