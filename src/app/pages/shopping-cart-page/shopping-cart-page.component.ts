import { Component } from '@angular/core';
import { CartListComponent } from '../../features/components/cart/cart-list/cart-list.component';

@Component({
    selector: 'app-shopping-cart-page',
    template:
        `
            <div class="card">
                <app-cart-list></app-cart-list>
            </div>
        `,
    imports: [CartListComponent]
})
export class ShoppingCartPageComponent {}
