import { Component, inject } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { CartService } from '../../../../service/cart.service';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-cart-total',
    templateUrl: './cart-total.component.html',
    styleUrl: './cart-total.component.scss',
    standalone: true,
    imports: [NgIf, CurrencyPipe, Card]
})
export class CartTotalComponent {
    private cartService = inject(CartService);

    cartItems = this.cartService.cartItems;
    subTotal = this.cartService.subTotal;
    deliveryFee = this.cartService.deliveryFee;
    tax = this.cartService.tax;
    totalPrice = this.cartService.totalPrice;
}
