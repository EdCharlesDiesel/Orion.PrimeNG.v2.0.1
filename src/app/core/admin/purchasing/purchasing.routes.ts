import { Routes } from '@angular/router';
import { ProductVendorComponent } from './product-vendor/product-vendor.component';

export default [
    { path: 'product-vendor', data: { breadcrumb: 'Button' }, component: ProductVendorComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
