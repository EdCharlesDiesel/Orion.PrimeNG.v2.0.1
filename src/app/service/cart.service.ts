import { Injectable, computed, signal } from "@angular/core";
import { CartItem } from '../core/models/cart-item.model';
import { Product } from '../core/models/product';



@Injectable({
    providedIn: 'root'
})
export class CartService {
    cartItems = signal<CartItem[]>([]);
    public _cartItems = computed(() => this.cartItems());

    cartCount = computed(() => this.cartItems().reduce((accQty, item) => accQty + item.quantity, 0));

    subTotal = computed(() =>
        this.cartItems().reduce((accTotal, item) => {
            return accTotal + item.quantity * item.product.price;
        }, 0)
    );

    deliveryFee = computed<number>(() => (this.subTotal() < 50 ? 5.99 : 0));

    tax = computed(() => Math.round(this.subTotal() * 10.75) / 100);

    totalPrice = computed(() => this.subTotal() + this.deliveryFee() + this.tax());

    public addToCart(product: Product): void {
        const index = this.cartItems().findIndex((item) => item.product.productID === product.productID);
        if (index === -1) {
            this.cartItems.update((items) => [...items, { product, quantity: 1 }]);
        } else {
            this.cartItems.update((items) => [...items.slice(0, index), { ...items[index], quantity: items[index].quantity + 1 }, ...items.slice(index + 1)]);
        }
    }

    public removeFromCart(cartItem: CartItem): void {
        this.cartItems.update((items) => items.filter((item) => item.product.productID !== cartItem.product.productID));

        this.cartItems.update((items) => items.filter((item) => item.product.productID !== cartItem.product.productID));
    }

    public updateQuantity(cartItem: CartItem, quantity: number): void {
        this.cartItems.update((items) => items.map((item) => (item.product.productID === cartItem.product.productID ? { ...item, quantity } : item)));
    }

    public clearCart() {
        this.cartItems.set([]);
    }
}
