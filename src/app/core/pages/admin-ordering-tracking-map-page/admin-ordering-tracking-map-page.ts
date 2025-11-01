import { Component, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { Shipment } from '../../models/shipment.model';
import { AdminOrderTrackingMapComponent } from '../../admin/admin-order-tracking-map/admin-order-tracking-map.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-admin-ordering-tracking-map-page',
    standalone: true,
    imports: [Card, AdminOrderTrackingMapComponent, DatePipe],
    templateUrl: './admin-ordering-tracking-map-page.html',
    styleUrl:'admin-ordering-tracking-map-page.scss'
})
export class AdminOrderingTrackingMapPage implements OnInit {
    currentShipment: Shipment | null = null;

    ngOnInit() {
        this.loadShipmentData();
    }

    loadShipmentData() {
        this.currentShipment = {
            actualDelivery: undefined,
            carrier: 'UPS',
            dimensions: '12x8x4 in',
            items: [
                { name: 'Laptop', quantity: 1,  weight: 30,sku: "AXRRT",price: 3000 },
                { name: 'Accessories', quantity: 3, weight: 30,sku: "AXRRT",price: 3000}
            ],
            service: 'UPS Ground',
            signature: 'Not Required',
            trackingNumber: '1Z999AA10123456784',
            weight: 5.2,
            origin: 'Los Angeles, CA 90001',
            destination: 'New York, NY 10001',
            shippedDate: new Date('2024-10-25'),
            estimatedDelivery: new Date('2024-11-05'),
            status: 'In Transit',
            events: [
                {
                    status: 'Picked Up',
                    location: 'Los Angeles, CA 90001',
                    timestamp: new Date('2024-10-25T08:00:00'),
                    description: 'Package picked up from sender',
                    completed: true,
                    icon: 'pi pi-check'
                },
                {
                    status: 'In Transit',
                    location: 'Los Angeles Distribution Center',
                    timestamp: new Date('2024-10-25T14:30:00'),
                    description: 'Package processed at facility',
                    completed: true,
                    icon: 'pi pi-truck'
                },
                {
                    status: 'In Transit',
                    location: 'Phoenix, AZ 85001',
                    timestamp: new Date('2024-10-27T09:15:00'),
                    description: 'Package arrived at sorting facility',
                    completed: true,
                    icon: 'pi pi-truck'
                },
                {
                    status: 'In Transit',
                    location: 'Dallas, TX 75201',
                    timestamp: new Date('2024-10-29T11:45:00'),
                    description: 'Package in transit to next facility',
                    completed: true,
                    icon: 'pi pi-truck'
                },
                {
                    status: 'Out for Delivery',
                    location: 'New York, NY 10001',
                    timestamp: new Date('2024-11-05T07:30:00'),
                    description: 'Package loaded on delivery vehicle',
                    completed: false,
                    icon: 'pi pi-home'
                },
                {
                    status: 'Delivered',
                    location: 'New York, NY 10001',
                    timestamp: new Date('2024-11-05T16:00:00'),
                    description: 'Package delivered to recipient',
                    completed: false,
                    icon: 'pi pi-check-circle'
                }
            ]
        };
    }

    getStatusClass(status: string): string {
        const statusMap: { [key: string]: string } = {
            'In Transit': 'in-transit',
            Delivered: 'delivered',
            Pending: 'pending'
        };
        return statusMap[status] || 'pending';
    }
}
