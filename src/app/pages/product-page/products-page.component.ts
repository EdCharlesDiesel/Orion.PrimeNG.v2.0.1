import { Component,} from '@angular/core';
import { ProductComponent } from '../../core/admin/production/product/product.component';

@Component({
    selector: 'app-products-page',
    template: `
        <div class="card">
            <app-product></app-product>
        </div>
    `,
    imports: [ ProductComponent]
})
export class ProductsPageComponent {}
