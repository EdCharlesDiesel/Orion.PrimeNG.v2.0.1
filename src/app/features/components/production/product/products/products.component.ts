// import { Component, inject, OnInit } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { Router } from '@angular/router';
// import { MessageService, PrimeTemplate } from 'primeng/api';
// import { AsyncPipe, CommonModule, CurrencyPipe, NgClass, SlicePipe } from '@angular/common';
// import { Card } from 'primeng/card';
// import { ProgressSpinner } from 'primeng/progressspinner';
// import { Button, ButtonDirective } from 'primeng/button';
// import { Product } from '../../../../../core/models/product';
// import { CartService } from '../../../../../service/cart.service';
// import { selectProductsViewModel } from '../../../../../store/products/product.selectors';
// import * as ProductActions from '../../../../../store/products/product.actions';
// import * as CartActions from '../../../../../store/cart/cart.actions';
// import { Paginator } from 'primeng/paginator';
//
// @Component({
//     selector: 'app-product',
//     standalone: true,
//     templateUrl: 'products.component.html',
//     styleUrls: ['products.component.scss'],
//     imports: [Card, NgClass, ProgressSpinner, CurrencyPipe, SlicePipe, AsyncPipe, CommonModule, Paginator, Button, PrimeTemplate]
// })
// export class ProductsComponent implements OnInit {
//     private readonly store = inject(Store);
//     private readonly cartService = inject(CartService);
//     private readonly router = inject(Router);
//     private readonly messageService = inject(MessageService);
//
//     vm$ = this.store.select(selectProductsViewModel);
//
//     rows = 8;
//     first = 0;
//     paginatedProducts: Product[] = [];
//     wishlist: Product[] = [];
//
//     ngOnInit(): void {
//         this.loadProducts();
//
//         // Automatically paginate when VM changes
//         this.vm$.subscribe((vm) => {
//             if (vm && vm.products) {
//                 this.paginatedProducts = vm.products.slice(this.first, this.first + this.rows);
//             }
//         });
//     }
//
//     loadProducts(): void {
//         this.store.dispatch(ProductActions.loadProducts());
//     }
//
//     onPageChange(event: any): void {
//         this.first = event.first;
//         const start = event.first;
//         const end = event.first + event.rows;
//
//         this.vm$.subscribe((vm) => {
//             this.paginatedProducts = vm.products.slice(start, end);
//         });
//     }
//
//     addToCart(product: Product): void {
//         if ((product.quantityInStock ?? 0) > 0) {
//             this.store.dispatch(CartActions.addToCart({ product, quantity: 1 }));
//             this.store.dispatch(
//                 ProductActions.decrementProductQuantity({
//                     id: product.productID,
//                     amount: 1
//                 })
//             );
//
//             this.messageService.add({
//                 severity: 'success',
//                 summary: 'Added to Cart',
//                 detail: `${product.title} added to cart!`,
//                 life: 3000
//             });
//         } else {
//             this.messageService.add({
//                 severity: 'warn',
//                 summary: 'Out of Stock',
//                 detail: `${product.title} is currently out of stock.`,
//                 life: 3000
//             });
//         }
//     }
//
//     addToWishlist(product: Product): void {
//         const exists = this.wishlist.some((p) => p.productID === product.productID);
//         if (!exists) {
//             this.wishlist.push(product);
//             this.messageService.add({
//                 severity: 'info',
//                 summary: 'Wishlist',
//                 detail: `${product.title} added to your wishlist.`,
//                 life: 3000
//             });
//         } else {
//             this.messageService.add({
//                 severity: 'warn',
//                 summary: 'Already in Wishlist',
//                 detail: `${product.title} is already in your wishlist.`,
//                 life: 3000
//             });
//         }
//     }
//
//     isOutOfStock(product: Product): boolean {
//         return (product.quantityInStock ?? 0) === 0;
//     }
//
//     isLowStock(product: Product): boolean {
//         const quantity = product.quantityInStock ?? 0;
//         return quantity > 0 && quantity <= 5;
//     }
//
//     trackByProductId(index: number, product: Product): number {
//         return product.productID;
//     }
// }
