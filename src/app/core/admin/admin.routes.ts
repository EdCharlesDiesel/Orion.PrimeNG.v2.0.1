import { AccessDeniedComponent } from '../authentication/access-denied/access-denied.component';
import { ErrorComponent } from '../authentication/error/error.component';
import { AdminProductListComponent } from './production/admin-product/admin-product-list/admin-product-list.component';
import { Routes } from '@angular/router';
import { AdminProductNewComponent } from './production/admin-product/admin-product-new/admin-product-new.component';
import { AdminShipmentTrackingComponent } from './admin-shipment-tracking/admin-shipment-tracking.component';
import { AdminOrderTrackingMapComponent } from './admin-order-tracking-map/admin-order-tracking-map.component';
import {
    AdminOrderingTrackingMapPage
} from '../pages/admin-ordering-tracking-map-page/admin-ordering-tracking-map-page';


export default [
    { path: 'access', component: AccessDeniedComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'admin-shipping-tracking', data: { breadcrumb: 'Button' }, component: AdminShipmentTrackingComponent },
    { path: 'admin-order-tracking-map', data: { breadcrumb: 'Button' }, component: AdminOrderingTrackingMapPage },
    { path: 'admin-shipping-tracking', data: { breadcrumb: 'Button' }, component: AdminShipmentTrackingComponent },
] as Routes;
