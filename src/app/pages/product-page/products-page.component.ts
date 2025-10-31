import { Component,} from '@angular/core';
import ProductsComponent from '../../features/components/production/product/products/products.component';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-products-page',
    template: `<p-card> <app-products></app-products> </p-card>`,
    imports: [Card, ProductsComponent]
})
export class ProductsPageComponent {}
