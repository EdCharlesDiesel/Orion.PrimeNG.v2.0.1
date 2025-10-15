import { Component } from '@angular/core';
import { GdpPerCountryComponent } from '../../trading-economics/gdp-per-country/gdp-per-country.component';
import { CartListComponent } from '../../features/components/cart/cart-list/cart-list.component';

@Component({
    selector: 'app-shopping-cart-page',
    templateUrl: './shopping-cart.component.html',
    styleUrl: './shopping-cart.component.scss',
    imports: [CartListComponent]
})
export class ShoppingCartComponent {}
