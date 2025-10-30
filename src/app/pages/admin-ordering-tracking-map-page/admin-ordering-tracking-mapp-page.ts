import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { Shipment } from '../../core/models/shipment.model';
import {
    AdminOrderTrackingMapComponent
} from '../../core/admin/admin-order-tracking-map/admin-order-tracking-map.component';

@Component({
    selector: 'app-admin-ordering-tracking-map-page',
    standalone: true,
    imports: [Card, AdminOrderTrackingMapComponent],
    template: `
        <p-card>
            <div class="p-4">
                <h2>Order Tracking Map</h2>

                <div class="grid">
                    <div class="col-12 md:col-8">
                        AdminOrderTrackingMapComponent
                        <app-admin-order-tracking-map [shipment]="selectedShipment" [height]="'500px'" [showRoute]="true" [showEvents]="true"> </app-admin-order-tracking-map>
                    </div>

                    <div class="col-12 md:col-4">
                        <!-- Shipment details component -->
                    </div>
                </div>
            </div>
        </p-card>
    `
})
export class AdminOrderingTrackingMapPage {
    selectedShipment: Shipment | null = null;
}
