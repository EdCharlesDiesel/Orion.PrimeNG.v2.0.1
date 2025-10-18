import { ProductComponent } from './product/product.component';
import { Routes } from '@angular/router';

export default [
    { path: 'product', data: { breadcrumb: 'Button' }, component: ProductComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
