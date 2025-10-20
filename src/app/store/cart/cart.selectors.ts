import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';


export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItemCount = createSelector(
  selectCartState,
  (state: CartState) => state.items.reduce((sum, item) => sum + item.quantity, 0)
);
export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items
);

export const selectCartTotalItems = createSelector(
  selectCartState,
  (state: CartState) => state.totalItems
);

export const selectCartTotalPrice = createSelector(
  selectCartState,
  (state: CartState) => state.totalPrice
);

export const selectCartItemByProductId = (productId: number) => createSelector(
  selectCartItems,
  (items) => items.find(item => item.product.productID === productId)
);

export const selectCartViewModel = createSelector(
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  (items, totalItems, totalPrice) => ({
    items,
    totalItems,
    totalPrice
  })
);
