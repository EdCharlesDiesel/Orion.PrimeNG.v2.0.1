import { Component, computed, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import {  CommonModule, NgOptimizedImage,   SlicePipe } from '@angular/common';

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
import { MegaMenu } from 'primeng/megamenu';
import { tap } from 'rxjs/operators';
import { ProductService } from '../../../../../service/product.service';

@Component({
    selector: 'app-products',
    standalone: true,
    templateUrl: 'products.component.html',
    styleUrls: ['products.component.scss'],
    imports: [Card, SlicePipe, CommonModule, Button, PrimeTemplate, ConfirmDialog, Dialog, GalleriaModule, Rating, Tag, Toast, FormsModule, MegaMenu, NgOptimizedImage, NgOptimizedImage, NgOptimizedImage, NgOptimizedImage],
    providers: [ConfirmationService, MessageService]
})
class ProductsComponent implements OnInit {
    products = signal<Product[]>([]);
    megaMenuItems = [
        {
            label: 'Fashion',
            icon: 'pi pi-fw pi-tag',
            items: [
                [
                    {
                        label: 'Woman',
                        items: [{ label: 'Woman Item' }, { label: 'Woman Item' }, { label: 'Woman Item' }]
                    },
                    {
                        label: 'Men',
                        items: [{ label: 'Men Item' }, { label: 'Men Item' }, { label: 'Men Item' }]
                    }
                ],
                [
                    {
                        label: 'Kids',
                        items: [{ label: 'Kids Item' }, { label: 'Kids Item' }]
                    },
                    {
                        label: 'Luggage',
                        items: [{ label: 'Luggage Item' }, { label: 'Luggage Item' }, { label: 'Luggage Item' }]
                    }
                ]
            ]
        },
        {
            label: 'Electronics',
            icon: 'pi pi-fw pi-desktop',
            items: [
                [
                    {
                        label: 'Computer',
                        items: [{ label: 'Computer Item' }, { label: 'Computer Item' }]
                    },
                    {
                        label: 'Camcorder',
                        items: [{ label: 'Camcorder Item' }, { label: 'Camcorder Item' }, { label: 'Camcorder Item' }]
                    }
                ],
                [
                    {
                        label: 'TV',
                        items: [{ label: 'TV Item' }, { label: 'TV Item' }]
                    },
                    {
                        label: 'Audio',
                        items: [{ label: 'Audio Item' }, { label: 'Audio Item' }, { label: 'Audio Item' }]
                    }
                ],
                [
                    {
                        label: 'Sports.7',
                        items: [{ label: 'Sports.7.1' }, { label: 'Sports.7.2' }]
                    }
                ]
            ]
        },
        {
            label: 'Furniture',
            icon: 'pi pi-fw pi-image',
            items: [
                [
                    {
                        label: 'Living Room',
                        items: [{ label: 'Living Room Item' }, { label: 'Living Room Item' }]
                    },
                    {
                        label: 'Kitchen',
                        items: [{ label: 'Kitchen Item' }, { label: 'Kitchen Item' }, { label: 'Kitchen Item' }]
                    }
                ],
                [
                    {
                        label: 'Bedroom',
                        items: [{ label: 'Bedroom Item' }, { label: 'Bedroom Item' }]
                    },
                    {
                        label: 'Outdoor',
                        items: [{ label: 'Outdoor Item' }, { label: 'Outdoor Item' }, { label: 'Outdoor Item' }]
                    }
                ]
            ]
        },
        {
            label: 'Sports',
            icon: 'pi pi-fw pi-star',
            items: [
                [
                    {
                        label: 'Basketball',
                        items: [{ label: 'Basketball Item' }, { label: 'Basketball Item' }]
                    },
                    {
                        label: 'Football',
                        items: [{ label: 'Football Item' }, { label: 'Football Item' }, { label: 'Football Item' }]
                    }
                ],
                [
                    {
                        label: 'Tennis',
                        items: [{ label: 'Tennis Item' }, { label: 'Tennis Item' }]
                    }
                ]
            ]
        }
    ];
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
        private confirmationService: ConfirmationService,
        private productService: ProductService
    ) {}

    ngOnInit() {
        this.loadProductData();
    }

    loadProductData() {
        this.productService
            .getProducts()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe((data: any) => {
                this.products.set(data);
                console.log(JSON.stringify(data));
            });
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
                code: undefined,
                modifiedDate: undefined,
                inventoryStatus: undefined
            }
        ];

        this.specialProducts.set(sampleProducts);
        this.featuredProduct.set(sampleProducts.find((product) => product.isFeatured) || sampleProducts[0]);
    }

    filteredProducts = computed(() => {
        const products = this.specialProducts();
        const category = this.selectedCategory();

        if (category === 'All') {
            return products;
        }

        return products.filter((product) => product.productLine === category);
        // return products.filter((product) => product.category === category);


    });

    getTimeRemaining(endDate: Date): { days: number; hours: number; minutes: number } {
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        };
    }


    today: (new () => Date) | undefined;
    getGalleryImages(product: Product) {
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

    getDiscountColor(percentage: number = 50): string {
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
