// import {Component, Input, OnInit} from '@angular/core';
// import {ActivatedRoute, Router} from '@angular/router';
// import {Observable} from 'rxjs';
// import {map} from "rxjs/operators";
// import {User} from "../../../pages/user-login/user";
// import {Product} from "../../../api/product";
// import {SubscriptionService} from "../../../service/subscription.service";
// import {ProductService} from "../../../service/product.service";
//
// @Component({
//   selector: 'app-product-card',
//   templateUrl: './product-card.component.html',
//   styleUrls: ['./product-card.component.scss']
// })
// export class ProductCardComponent implements OnInit {
//
//   @Input()
//   book?: Product;
//   id?: any;
//   isActive = false;
//   userData$: Observable<User> = new Observable<any>();
//   ProductDetails$: any;
//
//
//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private subscriptionService: SubscriptionService,
//     private bookService: ProductService) {
//     this.id = this.route.snapshot.paramMap.get('id');
//   }
//
//   ngOnInit() {
// //    this.userData$ = this.subscriptionService.userData;
//     this.ProductDetails$ = this.bookService.books$.pipe(map(book => book.find(b => b.id === this.id)));
//     console.log('Products Details',this.ProductDetails$);
//   }
//
//   goToPage(id: number) {
//     this.router.navigate(['/books/details/', id]);
//   }
// }
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RatingModule } from 'primeng/rating';
import { BadgeModule } from 'primeng/badge';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../../core/models/product';
import { Paginator } from 'primeng/paginator';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

interface ProductsViewModel {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    totalInventory: number;
}

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        CardModule,
        ImageModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        RatingModule,
        BadgeModule,
        FormsModule,
        Paginator,
        ProgressSpinner,
    ]
})
export class ProductCardComponent {
    @Input() ProductDetails$!: Observable<Product> | null;
    @Input() product: any;
    @Input() userData$!: Observable<any> | null;
    private messageService = inject(MessageService);
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

    isActive = false;

    getStockStatus(stock: number): string {
        if (stock === 0) return 'Out of Stock';
        if (stock <= 5) return 'Low Stock';
        if (stock <= 20) return 'In Stock';
        return 'Available';
    }

    getStockSeverity(stock: number): string {
        if (stock === 0) return 'danger';
        if (stock <= 5) return 'warning';
        return 'success';
    }

    quickView(product: Product) {
        // Implement quick view logic
        console.log('Quick view:', product);
    }



    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);

        // setTimeout(() => {
        //     try {
        //         const sampleProducts: Product[] = [
        //             {
        //                 productID: 1,
        //                 title: "Fjallraven - Foldsack No. 1 Backpack",
        //                 price: 109.95,
        //                 description: "Your perfect pack for everyday use and walks in the forest.",
        //                 category: "men's clothing",
        //                 image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        //                 rating: { rate: 3.9, count: 120 },
        //                 quantityInStock: 15,
        //                 unitMeasure
        //             }
        //         ];
        //
        //         this.productsSubject.next(sampleProducts);
        //         this.loadingSubject.next(false);
        //     } catch (error) {
        //         this.errorSubject.next('Failed to load products. Please try again.');
        //         this.loadingSubject.next(false);
        //     }
        // }, 1500);
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
