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
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RatingModule } from 'primeng/rating';
import { BadgeModule } from 'primeng/badge';
import { FormsModule } from '@angular/forms';

interface ProductDetails {
    id: number;
    title: string;
    retailPrice: number;
    originalPrice?: number;
    rating?: number;
    reviewCount?: number;
    quantityInStock?: number;
    isNew?: boolean;
    discount?: number;
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
        FormsModule
        // Add your custom components:
        // AddToCartComponent,
        // AddToWishlistComponent
    ]
})
export class ProductCardComponent {
    @Input() ProductDetails$!: Observable<ProductDetails> | null;
    @Input() product: any;
    @Input() userData$!: Observable<any> | null;

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

    quickView(product: ProductDetails) {
        // Implement quick view logic
        console.log('Quick view:', product);
    }

    addToCart(product: ProductDetails) {
        // Implement add to cart logic
        console.log('Add to cart:', product);
    }
}
