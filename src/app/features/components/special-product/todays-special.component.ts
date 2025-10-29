// todays-special.component.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { BadgeModule } from 'primeng/badge';
import { GalleriaModule } from 'primeng/galleria';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SpecialProduct } from '../../../core/models/special-product.model';

@Component({
    selector: 'app-todays-special',
    templateUrl: './todays-special.component.html',
    styleUrls: ['./todays-special.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        TagModule,
        DialogModule,
        RatingModule,
        BadgeModule,
        GalleriaModule,
        ToastModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class TodaysSpecialComponent implements OnInit {
    // Using signals for reactive state management
    specialProducts = signal<SpecialProduct[]>([]);
    featuredProduct = signal<SpecialProduct | null>(null);
    selectedProduct = signal<SpecialProduct | null>(null);
    displayProductDialog = signal(false);
    displayGallery = signal(false);
    activeIndex = signal(0);

    // Categories for filtering
    categories = signal(['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports', 'Books']);
    selectedCategory = signal('All');

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadTodaysSpecials();
    }

    loadTodaysSpecials() {
        const today = new Date();
        const sampleProducts: SpecialProduct[] = [
            {
                id: 1,
                name: 'Wireless Noise Cancelling Headphones',
                description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life. Perfect for travel and work.',
                originalPrice: 299.99,
                discountPrice: 199.99,
                discountPercentage: 33,
                category: 'Electronics',
                imageUrl: 'assets/images/headphones.jpg',
                isFeatured: true,
                tags: ['Limited Time', 'Best Seller', 'Audio'],
                availableUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
                stock: 15,
                rating: 4.8,
                reviewCount: 1247,
                isNew: true,
                productID: undefined,
                price: undefined,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: undefined,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: 0,
                sellStartDate: undefined,
                rowguid: undefined,
                image: undefined,
                code: undefined,
                modifiedDate: undefined
            },
            {
                id: 2,
                name: 'Organic Skincare Set',
                description: 'Complete skincare routine with organic ingredients. Includes cleanser, toner, serum, and moisturizer.',
                originalPrice: 120.0,
                discountPrice: 79.99,
                discountPercentage: 33,
                category: 'Beauty',
                imageUrl: 'assets/images/skincare.jpg',
                isFeatured: false,
                tags: ['Organic', 'Bestseller', 'Skincare'],
                availableUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                stock: 8,
                rating: 4.6,
                reviewCount: 892,
                isNew: false,
                productID: undefined,
                price: undefined,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: undefined,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: 0,
                sellStartDate: undefined,
                rowguid: undefined,
                image: undefined,
                code: undefined,
                modifiedDate: undefined
            },
            {
                id: 3,
                name: 'Smart Fitness Watch',
                description: 'Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life. Water resistant up to 50m.',
                originalPrice: 249.99,
                discountPrice: 179.99,
                discountPercentage: 28,
                category: 'Sports',
                imageUrl: 'assets/images/smartwatch.jpg',
                isFeatured: false,
                tags: ['Smart', 'Fitness', 'Tech'],
                availableUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
                stock: 22,
                rating: 4.7,
                reviewCount: 1563,
                isNew: true,
                productID: undefined,
                price: undefined,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: undefined,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: 0,
                sellStartDate: undefined,
                rowguid: undefined,
                image: undefined,
                code: undefined,
                modifiedDate: undefined
            },
            {
                id: 4,
                name: 'Designer Leather Handbag',
                description: 'Handcrafted genuine leather handbag with multiple compartments. Perfect for work and casual outings.',
                originalPrice: 189.99,
                discountPrice: 129.99,
                discountPercentage: 32,
                category: 'Fashion',
                imageUrl: 'assets/images/handbag.jpg',
                isFeatured: false,
                tags: ['Designer', 'Leather', 'Fashion'],
                availableUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
                stock: 12,
                rating: 4.9,
                reviewCount: 734,
                isNew: false,
                productID: undefined,
                price: undefined,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: undefined,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: 0,
                sellStartDate: undefined,
                rowguid: undefined,
                image: undefined,
                code: undefined,
                modifiedDate: undefined
            },
            {
                id: 5,
                name: 'Smart Home Speaker',
                description: 'Voice-controlled smart speaker with premium sound quality and smart home integration.',
                originalPrice: 159.99,
                discountPrice: 99.99,
                discountPercentage: 38,
                category: 'Electronics',
                imageUrl: 'assets/images/speaker.jpg',
                isFeatured: false,
                tags: ['Smart Home', 'Audio', 'Voice Control'],
                availableUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
                stock: 18,
                rating: 4.5,
                reviewCount: 2105,
                isNew: true,
                productID: undefined,
                price: undefined,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: undefined,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: 0,
                sellStartDate: undefined,
                rowguid: undefined,
                image: undefined,
                code: undefined,
                modifiedDate: undefined
            },
            {
                id: 6,
                name: 'Professional Cookware Set',
                description: '10-piece non-stick cookware set with induction compatibility and lifetime warranty.',
                originalPrice: 299.99,
                discountPrice: 199.99,
                discountPercentage: 33,
                category: 'Home & Kitchen',
                imageUrl: 'assets/images/cookware.jpg',
                isFeatured: false,
                tags: ['Kitchen', 'Professional', 'Non-Stick'],
                availableUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
                stock: 25,
                rating: 4.8,
                reviewCount: 1678,
                isNew: false,
                productID: undefined,
                price: undefined,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: undefined,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: 0,
                sellStartDate: undefined,
                rowguid: undefined,
                image: undefined,
                code: undefined,
                modifiedDate: undefined
            }
        ];

        this.specialProducts.set(sampleProducts);
        this.featuredProduct.set(sampleProducts.find(product => product.isFeatured) || sampleProducts[0]);
    }

    // Computed signals for filtered products
    filteredProducts = computed(() => {
        const products = this.specialProducts();
        const category = this.selectedCategory();

        if (category === 'All') {
            return products;
        }

        return products.filter(product => product.category === category);
    });

    // Computed signal for time remaining
    getTimeRemaining(endDate: Date): { days: number, hours: number, minutes: number } {
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        };
    }

    // Computed signal for gallery images
    today: (new () => Date) | undefined;
    getGalleryImages(product: SpecialProduct) {
        // In a real app, you might have multiple images per product
        return [
            {
                itemImageSrc: product.imageUrl,
                thumbnailImageSrc: product.imageUrl,
                alt: product.name,
                title: product.name
            }
        ];
    }

    viewProductDetails(product: SpecialProduct) {
        this.selectedProduct.set(product);
        this.displayProductDialog.set(true);
    }

    openGallery(product: SpecialProduct, index: number) {
        this.selectedProduct.set(product);
        this.activeIndex.set(index);
        this.displayGallery.set(true);
    }

    addToCart(product: SpecialProduct) {
        this.confirmationService.confirm({
            message: `Add "${product.name}" to your cart for $${product.discountPrice}?`,
            header: 'Add to Cart',
            icon: 'pi pi-shopping-cart',
            accept: () => {
                // In a real app, you would call a cart service here
                this.messageService.add({
                    severity: 'success',
                    summary: 'Added to Cart',
                    detail: `${product.name} has been added to your shopping cart`,
                    life: 3000
                });
            }
        });
    }

    addToWishlist(product: SpecialProduct) {
        // In a real app, you would call a wishlist service here
        this.messageService.add({
            severity: 'info',
            summary: 'Added to Wishlist',
            detail: `${product.name} has been added to your wishlist`,
            life: 3000
        });
    }

    getStockStatus(stock: number): { severity: string, label: string } {
        if (stock > 20) return { severity: 'success', label: 'In Stock' };
        if (stock > 5) return { severity: 'warning', label: 'Low Stock' };
        if (stock > 0) return { severity: 'danger', label: 'Almost Gone' };
        return { severity: 'danger', label: 'Out of Stock' };
    }

    getDiscountColor(percentage: number): string {
        if (percentage >= 40) return 'danger';
        if (percentage >= 25) return 'warning';
        return 'success';
    }

    formatTimeRemaining(endDate: Date): string {
        const time = this.getTimeRemaining(endDate);
        if (time.days > 0) {
            return `${time.days}d ${time.hours}h left`;
        } else if (time.hours > 0) {
            return `${time.hours}h ${time.minutes}m left`;
        } else {
            return `${time.minutes}m left`;
        }
    }

    isAlmostExpired(endDate: Date): boolean {
        const time = this.getTimeRemaining(endDate);
        return time.days === 0 && time.hours < 6;
    }

    selectCategory(category: string) {
        this.selectedCategory.set(category);
    }
}
