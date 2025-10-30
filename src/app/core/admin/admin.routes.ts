import { AccessDeniedComponent } from '../authentication/access-denied/access-denied.component';
import { ErrorComponent } from '../authentication/error/error.component';
import { AdminProductComponent } from './production/admin-product/admin-product.component';
import { Routes } from '@angular/router';
import { AdminProductNewComponent } from './production/admin-product-new/admin-product-new.component';
import { AdminShipmentTrackingComponent } from './admin-shipment-tracking/admin-shipment-tracking.component';
import { OrderTrackingMapComponent } from './admin-order-tracking-map/admin-order-tracking-map.component';


export default [
    { path: 'access', component: AccessDeniedComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'admin-product', data: { breadcrumb: 'Button' }, component: AdminProductComponent },
    { path: 'admin-product-new', data: { breadcrumb: 'Button' }, component: AdminProductNewComponent },
    { path: 'admin-shipping-tracking', data: { breadcrumb: 'Button' }, component: AdminShipmentTrackingComponent },
    { path: 'admin-order-tracking-map', data: { breadcrumb: 'Button' }, component: OrderTrackingMapComponent },
    { path: 'admin-shipping-tracking', data: { breadcrumb: 'Button' }, component: AdminShipmentTrackingComponent },
] as Routes;
