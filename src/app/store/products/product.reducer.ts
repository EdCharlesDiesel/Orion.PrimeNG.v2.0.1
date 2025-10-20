import { createReducer, on } from '@ngrx/store';
import {  initialProductState } from './product.state';
import * as ProductActions from './product.actions';

export const productReducer = createReducer(
  initialProductState,

  // Load Products
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products: products.map(product => ({
      ...product,
      // Set default quantity if not provided
      quantityInStock: product.quantityInStock ?? Math.floor(Math.random() * 50) + 10
    })),
    isLoading: false,
    error: null
  })),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Delete Product
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    isLoading: true
  })),

  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter(product => product.productID !== id),
    isLoading: false,
    error: null
  })),

  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Inventory Management
  on(ProductActions.updateProductQuantity, (state, { id, quantity }) => ({
    ...state,
    products: state.products.map(product =>
      product.productID === id
        ? { ...product, quantityInStock: Math.max(0, quantity) }
        : product
    )
  })),

  on(ProductActions.decrementProductQuantity, (state, { id, amount = 1 }) => ({
    ...state,
    products: state.products.map(product =>
      product.productID === id
        ? {
          ...product,
          quantityInStock: Math.max(0, (product.quantityInStock ?? 0) - amount)
        }
        : product
    )
  })),

  on(ProductActions.incrementProductQuantity, (state, { id, amount = 1 }) => ({
    ...state,
    products: state.products.map(product =>
      product.productID === id
        ? {
          ...product,
          quantityInStock: (product.quantityInStock ?? 0) + amount
        }
        : product
    )
  })),

  on(ProductActions.setInitialQuantities, (state, { quantities }) => ({
    ...state,
    products: state.products.map(product => ({
      ...product,
      quantityInStock: quantities[product.safetyStockLevel] ?? product.quantityInStock ?? 0
    }))
  }))
);
