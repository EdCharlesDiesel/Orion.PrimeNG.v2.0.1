import { AccessDeniedComponent } from '../authentication/access-denied/access-denied.component';
import { ErrorComponent } from '../authentication/error/error.component';
import { AdminProductComponent } from './production/admin-product/admin-product.component';
import AdminProductNewComponent from './production/admin-product-new/admin-product-new.component';
import { Routes } from '@angular/router';


export default [
    { path: 'access', component: AccessDeniedComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'admin-product', data: { breadcrumb: 'Button' }, component: AdminProductComponent },
    { path: 'admin-product-new', data: { breadcrumb: 'Button' }, component: AdminProductNewComponent },
] as Routes;
