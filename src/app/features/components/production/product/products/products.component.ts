import { Component, computed, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { AsyncPipe, CommonModule, CurrencyPipe, NgClass, SlicePipe } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Paginator } from 'primeng/paginator';
import { Button } from 'primeng/button';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';
import { Toast } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../../core/models/product';

@Component({
    selector: 'app-products',
    standalone: true,
    templateUrl: 'products.component.html',
    styleUrls: ['products.component.scss'],
    imports: [Card, SlicePipe, CommonModule, Button, PrimeTemplate, ConfirmDialog, Dialog, GalleriaModule, Rating, Tag, Toast, FormsModule],
    providers:[ ConfirmationService,MessageService ],
})
class ProductsComponent implements OnInit {
    specialProducts = signal<Product[]>([]);
    featuredProduct = signal<Product | null>(null);
    selectedProduct = signal<Product | null>(null);
    displayProductDialog = signal(false);
    displayGallery = signal(false);
    activeIndex = signal(0);
    categories = signal(['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports']);
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
        const sampleProducts: Product[] = [
            {
                productID: 1,
                inventoryStatus: '',
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
                quantityInStock: 15,
                rating: {
                    rate: 3.9,
                    count: 120
                },
                // reviewCount: 1247,
                isNew: true,
                title: undefined,
                price: 0,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: 0,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: undefined,
                sellStartDate: undefined,
                rowguid: undefined,
                code: undefined,
                modifiedDate: undefined
            },
            {
                productID: 2,
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
                quantityInStock: 8,
                rating: {
                    rate: 3.9,
                    count: 120
                },
                isNew: false,
                title: undefined,
                price: 0,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: 0,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: undefined,
                sellStartDate: undefined,
                rowguid: undefined,
                code: undefined,
                modifiedDate: undefined,
                inventoryStatus: undefined
            },
            {
                productID: 3,
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
                quantityInStock: 22,
                rating: {
                    rate: 3.9,
                    count: 120
                },

                isNew: true,
                title: undefined,
                price: 0,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: 0,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: undefined,
                sellStartDate: undefined,
                rowguid: undefined,
                code: undefined,
                modifiedDate: undefined,
                inventoryStatus: undefined
            },
            {
                productID: 4,
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
                quantityInStock: 12,
                rating: {
                    rate: 3.9,
                    count: 120
                },
                isNew: false,
                title: undefined,
                price: 0,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: 0,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: undefined,
                sellStartDate: undefined,
                rowguid: undefined,
                code: undefined,
                modifiedDate: undefined,
                inventoryStatus: undefined
            },
            {
                productID: 5,
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
                quantityInStock: 18,
                rating: {
                    rate: 3.9,
                    count: 120
                },

                isNew: true,
                title: undefined,
                price: 0,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: 0,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: undefined,
                sellStartDate: undefined,
                rowguid: undefined,
                code: undefined,
                modifiedDate: undefined,
                inventoryStatus: undefined
            },
            {
                productID: 6,
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
                quantityInStock: 25,
                rating: {
                    rate: 3.9,
                    count: 120
                },
                isNew: false,
                title: undefined,
                price: 0,
                productNumber: undefined,
                makeFlag: undefined,
                finishedGoodsFlag: undefined,
                safetyStockLevel: 0,
                reorderPoint: undefined,
                standardCost: undefined,
                listPrice: undefined,
                daysToManufacture: undefined,
                sellStartDate: undefined,
                rowguid: undefined,
                code: undefined,
                modifiedDate: undefined,
                inventoryStatus: undefined
            }
        ];

        this.specialProducts.set(sampleProducts);
        this.featuredProduct.set(sampleProducts.find((product) => product.isFeatured) || sampleProducts[0]);
    }

    // Computed signals for filtered products
    filteredProducts = computed(() => {
        const products = this.specialProducts();
        const category = this.selectedCategory();

        if (category === 'All') {
            return products;
        }

        return products.filter((product) => product.category === category);
    });

    // Computed signal for time remaining
    getTimeRemaining(endDate: Date): { days: number; hours: number; minutes: number } {
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
    getGalleryImages(product: Product) {
        // In a real app, you might have multiple images per product
        return [
            {
                itemImageSrc: product.imageUrl,
                thumbnailImageSrc: product.productProductPhotos,
                alt: product.name,
                title: product.name
            }
        ];
    }

    viewProductDetails(product: Product) {
        this.selectedProduct.set(product);
        this.displayProductDialog.set(true);
    }

    openGallery(product: Product, index: number) {
        this.selectedProduct.set(product);
        this.activeIndex.set(index);
        this.displayGallery.set(true);
    }

    addToCart(product: Product) {
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

    addToWishlist(product: Product) {
        // In a real app, you would call a wishlist service here
        this.messageService.add({
            severity: 'info',
            summary: 'Added to Wishlist',
            detail: `${product.name} has been added to your wishlist`,
            life: 3000
        });
    }

    getStockStatus(stock: number): { severity: string; label: string } {
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

export default ProductsComponent;
