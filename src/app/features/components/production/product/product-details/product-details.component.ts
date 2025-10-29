import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { GalleriaModule } from 'primeng/galleria';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../service/product.service';
import { Product } from '../../../../../core/models/product';
import { AuthService } from '../../../../../core/authentication/services/auth.service';
import { User } from '../../../../../core/models/user';

interface ProductDetails {
    id: number;
    title: string;
    retailPrice: number;
    cost?: number;
    coverFileName: string;
    category?: string;
    quantityInStock?: number;
    rating?: number;
    reviewCount?: number;
    // Add other product properties as needed
}

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        CardModule,
        ImageModule,
        TableModule,
        TagModule,
        ButtonModule,
        TabViewModule,
        GalleriaModule,
        RatingModule,
        FormsModule
        // Add your custom components:
        // AddToCartComponent,
        // AddToWishlistComponent,
        // AddToProductSubscriptionComponent
    ]
})
export class ProductDetailsComponent implements OnInit {
    @Input() id!: number;
    productDetails$!: Observable<Product>;
    authService = inject(AuthService);
    productService = inject(ProductService);
    userData$!: User | null;

    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    ngOnInit() {
        // Initialize your observables
        this.productDetails$ = this.productService.getProductById(this.id);
        // this.userData$ = this.authService.getCurrentUser();
    }

    getStockStatus(stock: Product | undefined): string {
        if (stock?.quantityInStock === 0) return 'Out of Stock';
        // if (stock?.quantityInStock <= 5) return 'Low Stock';
        return 'In Stock';
    }

    getStockSeverity(stock: number | undefined): string {
        if (stock === 0) return 'danger';
        // if (stock <= 5) return 'warning';
        return 'success';
    }

    getStockIcon(stock: number): string {
        if (stock === 0) return 'pi pi-times';
        if (stock <= 5) return 'pi pi-exclamation-triangle';
        return 'pi pi-check';
    }

    getProductImages(product: ProductDetails): any[] {
        // Return array of product images
        return [
            {
                itemImageSrc: '/assets/Upload/' + product.coverFileName + '.jpg',
                thumbnailImageSrc: '/assets/Upload/' + product.coverFileName + '.jpg',
                alt: product.title
            }
        ];
    }
}
