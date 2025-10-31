
import { Routes } from '@angular/router';
import { AdminProductListComponent } from './admin-product/admin-product-list/admin-product-list.component';
import { AdminProductNewComponent } from './admin-product/admin-product-new/admin-product-new.component';
import { AdminShipmentTrackingComponent } from '../admin-shipment-tracking/admin-shipment-tracking.component';

export default [
    { path: 'admin-product', data: { breadcrumb: 'Button' }, component: AdminProductListComponent },
    { path: 'admin-product-new', data: { breadcrumb: 'Button' }, component: AdminProductNewComponent },
    { path: 'admin-shipping-tracking', data: { breadcrumb: 'Button' }, component: AdminShipmentTrackingComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
