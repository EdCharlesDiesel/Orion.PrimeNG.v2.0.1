import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import {  CartItem, initialCartState } from './cart.state';

export const cartReducer = createReducer(
  initialCartState, // use only one initial state

  // Add to cart
  on(CartActions.addToCart, (state, { product, quantity = 1 }) => {
    const existingItem = state.items.find(item => item.product.productID === product.productID);
    let updatedItems: CartItem[];

    if (existingItem) {
      // Update quantity if item exists
      updatedItems = state.items.map(item =>
        item.product.productID === product.productID
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item
      updatedItems = [...state.items, { product, quantity }];
    }

    return {
      ...state,
      items: updatedItems,
      totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    };
  }),

  // Remove from cart
  on(CartActions.removeFromCart, (state, { productId }) => {
    const updatedItems = state.items.filter(item => item.product.productID !== productId);

    return {
      ...state,
      items: updatedItems,
      totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    };
  }),

  // Update quantity of a cart item
  on(CartActions.updateCartItemQuantity, (state, { productId, quantity }) => {
    let updatedItems: CartItem[];

    if (quantity <= 0) {
      // Remove item if quantity is zero
      updatedItems = state.items.filter(item => item.product.productID !== productId);
    } else {
      updatedItems = state.items.map(item =>
        item.product.productID === productId ? { ...item, quantity } : item
      );
    }

    return {
      ...state,
      items: updatedItems,
      totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    };
  }),

  // Clear cart
  on(CartActions.clearCart, () => initialCartState),

  // Load cart success
  on(CartActions.loadCartSuccess, (state, { items }) => ({
    ...state,
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }))
);
