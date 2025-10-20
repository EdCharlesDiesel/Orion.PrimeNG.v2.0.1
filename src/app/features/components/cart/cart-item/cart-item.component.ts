import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../../store/cart/cart.state';
import { Store } from '@ngrx/store';
import { selectProductById } from '../../../../store/products/product.selectors';
import *  as CartActions from '../../../../store/cart/cart.actions';
import *  as ProductActions from '../../../../store/products/product.actions';
import { DropdownModule } from 'primeng/dropdown';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-cart-item',
    standalone: true,
    imports: [CommonModule, FormsModule, DropdownModule, Card],
    templateUrl: './cart-item.component.html',
    styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {
    @Input() cartItem!: CartItem;

    private store = inject(Store);

    // Get the current product from products store to check available quantity
    availableStock = signal<number>(0);

    // Computed quantity array based on available stock
    qtyArr = computed(() => {
        const maxQty = Math.min(
            this.availableStock() + this.cartItem.quantity, // Current available + what's in cart
            20 // Maximum 20 items
        );
        return Array.from({ length: maxQty }, (_, i) => i + 1);
    });

    // Computed extended price
    exPrice = computed(() => {
        return this.cartItem.product.price * this.cartItem.quantity;
    });

    ngOnInit(): void {
        // Subscribe to product updates to get current stock
        this.store.select(selectProductById(this.cartItem.product.productID)).subscribe((product) => {
            if (product) {
                this.availableStock.set(product.quantityInStock ?? 0);
            }
        });
    }

    onQuantitySelected(newQuantity: number): void {
        const quantityDiff = newQuantity - this.cartItem.quantity;

        if (quantityDiff > 0) {
            // Increasing quantity - check if we have enough stock
            if (quantityDiff <= this.availableStock()) {
                this.updateQuantity(newQuantity, quantityDiff);
            } else {
                alert(`Only ${this.availableStock()} items available in stock!`);
            }
        } else if (quantityDiff < 0) {
            // Decreasing quantity - return items to stock
            this.updateQuantity(newQuantity, quantityDiff);
        }
    }

    private updateQuantity(newQuantity: number, quantityDiff: number): void {
        // Update cart
        this.store.dispatch(
            CartActions.updateCartItemQuantity({
                productId: this.cartItem.product.productID,
                quantity: newQuantity
            })
        );

        // Update product stock
        if (quantityDiff > 0) {
            // Decrement stock (adding more to cart)
            this.store.dispatch(
                ProductActions.decrementProductQuantity({
                    id: this.cartItem.product.productID,
                    amount: quantityDiff
                })
            );
        } else {
            // Increment stock (removing from cart)
            this.store.dispatch(
                ProductActions.incrementProductQuantity({
                    id: this.cartItem.product.productID,
                    amount: Math.abs(quantityDiff)
                })
            );
        }
    }

    removeFromCart(): void {
        if (confirm('Are you sure you want to remove this item from cart?')) {
            // Return items to stock
            this.store.dispatch(
                ProductActions.incrementProductQuantity({
                    id: this.cartItem.product.productID,
                    amount: this.cartItem.quantity
                })
            );

            // Remove from cart
            this.store.dispatch(
                CartActions.removeFromCart({
                    productId: this.cartItem.product.productID
                })
            );
        }
    }
}
