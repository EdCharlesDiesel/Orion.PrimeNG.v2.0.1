import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import * as ProductActions from './product.actions';
import { InventoryService } from '../../service/inventory.service';
import { ProductService } from '../../service/product.service';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);
  private inventoryService = inject(InventoryService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.productService.getProducts().pipe(
          map(products => {
            // Try to load saved quantities
            const savedQuantities = this.inventoryService.loadQuantities();

            if (savedQuantities) {
              // Use saved quantities
              return ProductActions.loadProductsSuccess({
                products: products.map(p => ({
                  ...p,
                  quantityInStock: savedQuantities[p.safetyStockLevel] ?? Math.floor(Math.random() * 50) + 10
                }))
              });
            } else {
              // Generate new quantities
              const quantities = this.inventoryService.generateInitialQuantities(
                products.map(p => p.productID)
              );
              this.inventoryService.saveQuantities(quantities);

              return ProductActions.loadProductsSuccess({
                products: products.map(p => ({
                  ...p,
                  quantityInStock: quantities[p.safetyStockLevel]
                }))
              });
            }
          }),
          catchError(error =>
            of(ProductActions.loadProductsFailure({
              error: error.message || 'Failed to load products'
            }))
          )
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      switchMap(({ id }) =>
        this.productService.deleteProduct(id).pipe(
          map(() => ProductActions.deleteProductSuccess({ id })),
          catchError(error =>
            of(ProductActions.deleteProductFailure({
              error: error.message || 'Failed to delete product'
            }))
          )
        )
      )
    )
  );

  // Save inventory changes to localStorage
  saveInventory$ = createEffect(() =>
      this.actions$.pipe(
        ofType(
          ProductActions.updateProductQuantity,
          ProductActions.decrementProductQuantity,
          ProductActions.incrementProductQuantity
        ),
        tap(() => {
          // Note: In a real app, you'd get the current state and save it
          // This is a simplified version
        })
      ),
    { dispatch: false }
  );
}
