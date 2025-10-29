import { Component,} from '@angular/core';
import ProductsComponent from '../../features/components/production/product/products/products.component';

@Component({
    selector: 'app-products-page',
    template: ` <app-products></app-products> `,
    imports: [ProductsComponent]
})
export class ProductsPageComponent {}
