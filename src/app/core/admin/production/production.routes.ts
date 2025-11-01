import { AdminProductListComponent } from './admin-product/admin-product-list/admin-product-list.component';
import { AdminProductNewComponent } from './admin-product/admin-product-new/admin-product-new.component';
import { AdminShipmentTrackingComponent } from '../admin-shipment-tracking/admin-shipment-tracking.component';
import {
    AdminProductCategoryNewComponent
} from './admin-product-category/admin-product-category-new/admin-product-category-new.component';
import {
    AdminProductCategoryListComponent
} from './admin-product-category/admin-product-category-list/admin-product-category-list.component';
import {
    AdminProductSubCategoryNewComponent
} from './admin-product-sub-category/admin-product-sub-category-new/admin-product-sub-category-new.component';
import { Routes } from '@angular/router';
import {
    AdminProductSubCategoryListComponent
} from './admin-product-sub-category/admin-product-sub-category-list/admin-product-sub-category-list.component';

export default [
    { path: 'admin-product-list', data: { breadcrumb: 'Button' }, component: AdminProductListComponent },
    { path: 'admin-product-new', data: { breadcrumb: 'Button' }, component: AdminProductNewComponent },
    { path: 'admin-shipping-tracking', data: { breadcrumb: 'Button' }, component: AdminShipmentTrackingComponent },
    { path: 'admin-product-category-new', data: { breadcrumb: 'Button' }, component: AdminProductCategoryNewComponent },
    { path: 'admin-product-category-list', data: { breadcrumb: 'Button' }, component: AdminProductCategoryListComponent },
    { path: 'admin-product-sub-category-new', data: { breadcrumb: 'Button' }, component: AdminProductSubCategoryListComponent },
    { path: 'admin-product-sub-category-list', data: { breadcrumb: 'Button' }, component: AdminProductSubCategoryNewComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
