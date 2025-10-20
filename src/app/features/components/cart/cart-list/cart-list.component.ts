import { Component, inject } from '@angular/core';
import { CartService } from '../../../../service/cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartViewModel } from '../../../../store/cart/cart.selectors';
import * as CartActions from '../../../../store/cart/cart.actions';
import { Divider } from 'primeng/divider';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';
@Component({
    selector: 'app-cart-list',
    standalone: true,
    imports: [NgIf, NgFor, CartItemComponent, CurrencyPipe, RouterLink, AsyncPipe, Divider, Card, ButtonDirective, PrimeTemplate],
    templateUrl: 'cart-list.component.html',
    styleUrl: 'cart-list.component.scss'
})
export class CartListComponent {
    pageTitle = 'Shopping Cart';

    private cartService = inject(CartService);

    cartItems = this.cartService.cartItems;
    cartTotal = this.cartService.subTotal;
    cartTax = this.cartService.tax;
    cartSubtotal = this.cartService.totalPrice;

    private store = inject(Store);

    vm$ = this.store.select(selectCartViewModel);

    ngOnInit(): void {
        // Load cart from localStorage if needed
        this.store.dispatch(CartActions.loadCart());
    }

    constructor(private router: Router) {}
    clearCart(): void {
        if (confirm('Are you sure you want to clear the entire cart?')) {
            this.store.dispatch(CartActions.clearCart());
        }
    }

    checkout(): void {
        // Navigate to checkout page
        this.router.navigate(['/checkout']);
    }

    trackByProductId(index: number, item: any): number {
        return item.productId; // or 'id' depending on your model
    }
}
