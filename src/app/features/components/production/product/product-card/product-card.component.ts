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
        ProgressSpinner,
    ]
})
export class ProductCardComponent {
    // @Input() ProductDetails$!: any;
    // @Input() ProductDetails$!: Observable<Product> | null;
    @Input() product: any;
    // @Input() userData$!: Observable<any> | null;
    // @Input() userData$! : string
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

        setTimeout(() => {
            try {
                const sampleProducts: Product[] = [
                    {
                        inventoryStatus: '',
                        productID: 1,
                        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                        name: 'Fjallraven',
                        description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
                        category: 'mens clothing',
                        price: 109.95,
                        productNumber: 'CLT-001',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'reg',
                        safetyStockLevel: 10,
                        reorderPoint: 1,
                        standardCost: 89.95,
                        listPrice: 109.95,
                        size: 'M',
                        sizeUnitMeasureCode: 'medium',
                        weightUnitMeasureCode: 'MDM',
                        weight: 10,
                        daysToManufacture: 2,
                        productLine: 'null',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 21,
                        code: 100,
                        imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                        rating: {
                            rate: 3.9,
                            count: 120
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: 'INSTOCK',
                        productID: 2,
                        title: 'Mens Casual Premium Slim Fit T-Shirts',
                        name: 'SlimFit',
                        description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
                        category: 'mens clothing',
                        price: 22.3,
                        productNumber: 'CLT-002',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'black',
                        safetyStockLevel: 5,
                        reorderPoint: 1,
                        standardCost: 18.5,
                        listPrice: 22.3,
                        size: 'L',
                        sizeUnitMeasureCode: 'large',
                        weightUnitMeasureCode: 'LG',
                        weight: 12,
                        daysToManufacture: 1,
                        productLine: 'A',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 12,
                        code: 101,
                        imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
                        rating: {
                            rate: 4.1,
                            count: 259
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: '',
                        productID: 1,
                        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                        name: 'Fjallraven',
                        description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
                        category: 'mens clothing',
                        price: 109.95,
                        productNumber: 'CLT-001',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'reg',
                        safetyStockLevel: 10,
                        reorderPoint: 1,
                        standardCost: 89.95,
                        listPrice: 109.95,
                        size: 'M',
                        sizeUnitMeasureCode: 'medium',
                        weightUnitMeasureCode: 'MDM',
                        weight: 10,
                        daysToManufacture: 2,
                        productLine: 'null',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 21,
                        code: 100,
                        imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                        rating: {
                            rate: 3.9,
                            count: 120
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: 'INSTOCK',
                        productID: 2,
                        title: 'Mens Casual Premium Slim Fit T-Shirts',
                        name: 'SlimFit',
                        description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
                        category: 'mens clothing',
                        price: 22.3,
                        productNumber: 'CLT-002',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'black',
                        safetyStockLevel: 5,
                        reorderPoint: 1,
                        standardCost: 18.5,
                        listPrice: 22.3,
                        size: 'L',
                        sizeUnitMeasureCode: 'large',
                        weightUnitMeasureCode: 'LG',
                        weight: 12,
                        daysToManufacture: 1,
                        productLine: 'A',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 12,
                        code: 101,
                        imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
                        rating: {
                            rate: 4.1,
                            count: 259
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: '',
                        productID: 1,
                        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                        name: 'Fjallraven',
                        description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
                        category: 'mens clothing',
                        price: 109.95,
                        productNumber: 'CLT-001',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'reg',
                        safetyStockLevel: 10,
                        reorderPoint: 1,
                        standardCost: 89.95,
                        listPrice: 109.95,
                        size: 'M',
                        sizeUnitMeasureCode: 'medium',
                        weightUnitMeasureCode: 'MDM',
                        weight: 10,
                        daysToManufacture: 2,
                        productLine: 'null',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 21,
                        code: 100,
                        imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                        rating: {
                            rate: 3.9,
                            count: 120
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: 'INSTOCK',
                        productID: 2,
                        title: 'Mens Casual Premium Slim Fit T-Shirts',
                        name: 'SlimFit',
                        description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
                        category: 'mens clothing',
                        price: 22.3,
                        productNumber: 'CLT-002',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'black',
                        safetyStockLevel: 5,
                        reorderPoint: 1,
                        standardCost: 18.5,
                        listPrice: 22.3,
                        size: 'L',
                        sizeUnitMeasureCode: 'large',
                        weightUnitMeasureCode: 'LG',
                        weight: 12,
                        daysToManufacture: 1,
                        productLine: 'A',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 12,
                        code: 101,
                        imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
                        rating: {
                            rate: 4.1,
                            count: 259
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: '',
                        productID: 1,
                        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                        name: 'Fjallraven',
                        description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
                        category: 'mens clothing',
                        price: 109.95,
                        productNumber: 'CLT-001',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'reg',
                        safetyStockLevel: 10,
                        reorderPoint: 1,
                        standardCost: 89.95,
                        listPrice: 109.95,
                        size: 'M',
                        sizeUnitMeasureCode: 'medium',
                        weightUnitMeasureCode: 'MDM',
                        weight: 10,
                        daysToManufacture: 2,
                        productLine: 'null',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 21,
                        code: 100,
                        imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                        rating: {
                            rate: 3.9,
                            count: 120
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: 'INSTOCK',
                        productID: 2,
                        title: 'Mens Casual Premium Slim Fit T-Shirts',
                        name: 'SlimFit',
                        description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
                        category: 'mens clothing',
                        price: 22.3,
                        productNumber: 'CLT-002',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'black',
                        safetyStockLevel: 5,
                        reorderPoint: 1,
                        standardCost: 18.5,
                        listPrice: 22.3,
                        size: 'L',
                        sizeUnitMeasureCode: 'large',
                        weightUnitMeasureCode: 'LG',
                        weight: 12,
                        daysToManufacture: 1,
                        productLine: 'A',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 12,
                        code: 101,
                        imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
                        rating: {
                            rate: 4.1,
                            count: 259
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: '',
                        productID: 1,
                        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                        name: 'Fjallraven',
                        description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
                        category: 'mens clothing',
                        price: 109.95,
                        productNumber: 'CLT-001',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'reg',
                        safetyStockLevel: 10,
                        reorderPoint: 1,
                        standardCost: 89.95,
                        listPrice: 109.95,
                        size: 'M',
                        sizeUnitMeasureCode: 'medium',
                        weightUnitMeasureCode: 'MDM',
                        weight: 10,
                        daysToManufacture: 2,
                        productLine: 'null',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 21,
                        code: 100,
                        imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                        rating: {
                            rate: 3.9,
                            count: 120
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: 'INSTOCK',
                        productID: 2,
                        title: 'Mens Casual Premium Slim Fit T-Shirts',
                        name: 'SlimFit',
                        description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
                        category: 'mens clothing',
                        price: 22.3,
                        productNumber: 'CLT-002',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'black',
                        safetyStockLevel: 5,
                        reorderPoint: 1,
                        standardCost: 18.5,
                        listPrice: 22.3,
                        size: 'L',
                        sizeUnitMeasureCode: 'large',
                        weightUnitMeasureCode: 'LG',
                        weight: 12,
                        daysToManufacture: 1,
                        productLine: 'A',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 12,
                        code: 101,
                        imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
                        rating: {
                            rate: 4.1,
                            count: 259
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: '',
                        productID: 1,
                        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                        name: 'Fjallraven',
                        description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
                        category: 'mens clothing',
                        price: 109.95,
                        productNumber: 'CLT-001',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'reg',
                        safetyStockLevel: 10,
                        reorderPoint: 1,
                        standardCost: 89.95,
                        listPrice: 109.95,
                        size: 'M',
                        sizeUnitMeasureCode: 'medium',
                        weightUnitMeasureCode: 'MDM',
                        weight: 10,
                        daysToManufacture: 2,
                        productLine: 'null',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 21,
                        code: 100,
                        imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                        rating: {
                            rate: 3.9,
                            count: 120
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: 'INSTOCK',
                        productID: 2,
                        title: 'Mens Casual Premium Slim Fit T-Shirts',
                        name: 'SlimFit',
                        description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
                        category: 'mens clothing',
                        price: 22.3,
                        productNumber: 'CLT-002',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'black',
                        safetyStockLevel: 5,
                        reorderPoint: 1,
                        standardCost: 18.5,
                        listPrice: 22.3,
                        size: 'L',
                        sizeUnitMeasureCode: 'large',
                        weightUnitMeasureCode: 'LG',
                        weight: 12,
                        daysToManufacture: 1,
                        productLine: 'A',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 12,
                        code: 101,
                        imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
                        rating: {
                            rate: 4.1,
                            count: 259
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: '',
                        productID: 1,
                        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                        name: 'Fjallraven',
                        description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
                        category: 'mens clothing',
                        price: 109.95,
                        productNumber: 'CLT-001',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'reg',
                        safetyStockLevel: 10,
                        reorderPoint: 1,
                        standardCost: 89.95,
                        listPrice: 109.95,
                        size: 'M',
                        sizeUnitMeasureCode: 'medium',
                        weightUnitMeasureCode: 'MDM',
                        weight: 10,
                        daysToManufacture: 2,
                        productLine: 'null',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 21,
                        code: 100,
                        imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                        rating: {
                            rate: 3.9,
                            count: 120
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: 'INSTOCK',
                        productID: 2,
                        title: 'Mens Casual Premium Slim Fit T-Shirts',
                        name: 'SlimFit',
                        description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
                        category: 'mens clothing',
                        price: 22.3,
                        productNumber: 'CLT-002',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'black',
                        safetyStockLevel: 5,
                        reorderPoint: 1,
                        standardCost: 18.5,
                        listPrice: 22.3,
                        size: 'L',
                        sizeUnitMeasureCode: 'large',
                        weightUnitMeasureCode: 'LG',
                        weight: 12,
                        daysToManufacture: 1,
                        productLine: 'A',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 12,
                        code: 101,
                        imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
                        rating: {
                            rate: 4.1,
                            count: 259
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: '',
                        productID: 1,
                        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                        name: 'Fjallraven',
                        description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
                        category: 'mens clothing',
                        price: 109.95,
                        productNumber: 'CLT-001',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'reg',
                        safetyStockLevel: 10,
                        reorderPoint: 1,
                        standardCost: 89.95,
                        listPrice: 109.95,
                        size: 'M',
                        sizeUnitMeasureCode: 'medium',
                        weightUnitMeasureCode: 'MDM',
                        weight: 10,
                        daysToManufacture: 2,
                        productLine: 'null',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 21,
                        code: 100,
                        imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                        rating: {
                            rate: 3.9,
                            count: 120
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: 'INSTOCK',
                        productID: 2,
                        title: 'Mens Casual Premium Slim Fit T-Shirts',
                        name: 'SlimFit',
                        description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
                        category: 'mens clothing',
                        price: 22.3,
                        productNumber: 'CLT-002',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'black',
                        safetyStockLevel: 5,
                        reorderPoint: 1,
                        standardCost: 18.5,
                        listPrice: 22.3,
                        size: 'L',
                        sizeUnitMeasureCode: 'large',
                        weightUnitMeasureCode: 'LG',
                        weight: 12,
                        daysToManufacture: 1,
                        productLine: 'A',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 12,
                        code: 101,
                        imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
                        rating: {
                            rate: 4.1,
                            count: 259
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: '',
                        productID: 1,
                        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                        name: 'Fjallraven',
                        description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
                        category: 'mens clothing',
                        price: 109.95,
                        productNumber: 'CLT-001',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'reg',
                        safetyStockLevel: 10,
                        reorderPoint: 1,
                        standardCost: 89.95,
                        listPrice: 109.95,
                        size: 'M',
                        sizeUnitMeasureCode: 'medium',
                        weightUnitMeasureCode: 'MDM',
                        weight: 10,
                        daysToManufacture: 2,
                        productLine: 'null',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 21,
                        code: 100,
                        imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                        rating: {
                            rate: 3.9,
                            count: 120
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: 'INSTOCK',
                        productID: 2,
                        title: 'Mens Casual Premium Slim Fit T-Shirts',
                        name: 'SlimFit',
                        description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
                        category: 'mens clothing',
                        price: 22.3,
                        productNumber: 'CLT-002',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'black',
                        safetyStockLevel: 5,
                        reorderPoint: 1,
                        standardCost: 18.5,
                        listPrice: 22.3,
                        size: 'L',
                        sizeUnitMeasureCode: 'large',
                        weightUnitMeasureCode: 'LG',
                        weight: 12,
                        daysToManufacture: 1,
                        productLine: 'A',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 12,
                        code: 101,
                        imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
                        rating: {
                            rate: 4.1,
                            count: 259
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: '',
                        productID: 1,
                        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                        name: 'Fjallraven',
                        description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
                        category: 'mens clothing',
                        price: 109.95,
                        productNumber: 'CLT-001',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'reg',
                        safetyStockLevel: 10,
                        reorderPoint: 1,
                        standardCost: 89.95,
                        listPrice: 109.95,
                        size: 'M',
                        sizeUnitMeasureCode: 'medium',
                        weightUnitMeasureCode: 'MDM',
                        weight: 10,
                        daysToManufacture: 2,
                        productLine: 'null',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 21,
                        code: 100,
                        imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                        rating: {
                            rate: 3.9,
                            count: 120
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    },
                    {
                        inventoryStatus: 'INSTOCK',
                        productID: 2,
                        title: 'Mens Casual Premium Slim Fit T-Shirts',
                        name: 'SlimFit',
                        description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
                        category: 'mens clothing',
                        price: 22.3,
                        productNumber: 'CLT-002',
                        makeFlag: true,
                        finishedGoodsFlag: true,
                        color: 'black',
                        safetyStockLevel: 5,
                        reorderPoint: 1,
                        standardCost: 18.5,
                        listPrice: 22.3,
                        size: 'L',
                        sizeUnitMeasureCode: 'large',
                        weightUnitMeasureCode: 'LG',
                        weight: 12,
                        daysToManufacture: 1,
                        productLine: 'A',
                        class: 'M',
                        style: 'L',
                        productSubcategoryID: 1,
                        productModelID: 1,
                        sellStartDate: new Date(),
                        sellEndDate: new Date(),
                        discontinuedDate: new Date(),
                        rowguid: '',
                        quantityInStock: 12,
                        code: 101,
                        imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
                        rating: {
                            rate: 4.1,
                            count: 259
                        },
                        modifiedDate: new Date(),
                        tags: undefined,
                        originalPrice: undefined,
                        discountPercentage: undefined,
                        availableUntil: undefined,
                        isNew: undefined,
                        discountPrice: undefined,
                        isFeatured: false
                    }
                ];
                this.productsSubject.next(sampleProducts);
                this.loadingSubject.next(false);
            } catch (error) {
                this.errorSubject.next('Failed to load products. Please try again.');
                this.loadingSubject.next(false);
            }
        }, 1500);
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
