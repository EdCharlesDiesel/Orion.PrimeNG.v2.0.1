import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-order-confirmation',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './order-confirmation.component.html',
    styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent {
    private cartService = inject(CartService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    // Signals from cart
    cartItems = this.cartService.cartItems;
    subtotal = this.cartService.subTotal;
    tax = this.cartService.tax;
    total = this.cartService.totalPrice;

    confirmOrder() {
        this.messageService.add({
            severity: 'success', // success | info | warn | error
            summary: '✅ Order confirmed!', // title
            detail: `✅ Order confirmed! Thank you for your purchase.`, // message
            life: 3000 // duration in milliseconds
        });

        // Clear the cart
        this.cartService.clearCart();

        // Navigate back after 1 second (allow Snackbar to show)
        setTimeout(() => {
            this.router.navigate(['/products']);
        }, 1000);
    }
}
