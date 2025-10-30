
import { Routes } from '@angular/router';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminProductNewComponent } from './admin-product-new/admin-product-new.component';

export default [
    { path: 'admin-product', data: { breadcrumb: 'Button' }, component: AdminProductComponent },
    { path: 'admin-product-new', data: { breadcrumb: 'Button' }, component: AdminProductNewComponent },

    { path: '**', redirectTo: '/notfound' }
] as Routes;
