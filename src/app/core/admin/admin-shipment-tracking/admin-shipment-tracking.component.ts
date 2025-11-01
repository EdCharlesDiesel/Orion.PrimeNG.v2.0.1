import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Shipment, ShipmentItem, ShipmentTrackingEvent } from '../../models/shipment.model';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-admin-shipment-tracking',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, TimelineModule, TagModule, DividerModule, MessageModule, TableModule, ProgressSpinnerModule, Tooltip],
    templateUrl: 'admin-shipment-tracking.component.html',
    styleUrl: 'admin-shipment-tracking.component.scss'
})
export class AdminShipmentTrackingComponent implements OnInit {
    trackingNumber: string = '';
    shipment: Shipment | null = null;
    loading: boolean = false;
    error: string = '';

    private shipmentDatabase: { [key: string]: Shipment } = {
        'TRK-2025-001234': {
            trackingNumber: 'TRK-2025-001234',
            carrier: 'FedEx Express',
            service: 'Priority Overnight',
            status: 'in-transit',
            origin: 'Los Angeles, CA 90001',
            destination: 'New York, NY 10001',
            shippedDate: new Date('2025-10-28'),
            estimatedDelivery: new Date('2025-10-31'),
            weight: 2.5,
            dimensions: '30 x 20 x 15 cm',
            items: [
                { sku: 'ELEC-2024-001', name: 'Wireless Keyboard', quantity: 2, weight: 0.8, price: 79.99 },
                { sku: 'ELEC-2024-045', name: 'USB-C Hub', quantity: 1, weight: 0.3, price: 49.99 },
                { sku: 'ACC-2024-112', name: 'Cable Management Kit', quantity: 3, weight: 0.5, price: 24.99 }
            ],
            events: [
                {
                    status: 'Order Placed',
                    location: 'Los Angeles, CA',
                    timestamp: new Date('2025-10-28T09:15:00'),
                    description: 'Shipment information received',
                    icon: 'pi-file',
                    completed: true
                },
                {
                    status: 'Picked Up',
                    location: 'Los Angeles Distribution Center',
                    timestamp: new Date('2025-10-28T14:30:00'),
                    description: 'Package picked up by carrier',
                    icon: 'pi-truck',
                    completed: true
                },
                {
                    status: 'In Transit',
                    location: 'Phoenix, AZ Hub',
                    timestamp: new Date('2025-10-29T08:45:00'),
                    description: 'Package in transit to next facility',
                    icon: 'pi-box',
                    completed: true
                },
                {
                    status: 'Sorting Facility',
                    location: 'Dallas, TX',
                    timestamp: new Date('2025-10-30T03:20:00'),
                    description: 'Arrived at sorting facility',
                    icon: 'pi-building',
                    completed: true
                },
                {
                    status: 'Out for Delivery',
                    location: 'New York, NY',
                    timestamp: new Date(),
                    description: 'Package is out for delivery',
                    icon: 'pi-send',
                    completed: false
                },
                {
                    status: 'Delivered',
                    location: 'New York, NY 10001',
                    timestamp: new Date(),
                    description: 'Package delivered successfully',
                    icon: 'pi-check-circle',
                    completed: false
                }
            ]
        },
        'TRK-2025-005678': {
            trackingNumber: 'TRK-2025-005678',
            carrier: 'UPS Ground',
            service: 'Standard Ground',
            status: 'delivered',
            origin: 'Seattle, WA 98101',
            destination: 'Miami, FL 33101',
            shippedDate: new Date('2025-10-25'),
            estimatedDelivery: new Date('2025-10-29'),
            actualDelivery: new Date('2025-10-29T15:45:00'),
            weight: 5.2,
            dimensions: '45 x 35 x 25 cm',
            signature: 'J. Smith',
            items: [
                { sku: 'FURN-2024-201', name: 'Office Chair Parts', quantity: 1, weight: 4.5, price: 149.99 },
                { sku: 'FURN-2024-202', name: 'Assembly Hardware', quantity: 1, weight: 0.7, price: 19.99 }
            ],
            events: [
                {
                    status: 'Order Placed',
                    location: 'Seattle, WA',
                    timestamp: new Date('2025-10-25T10:00:00'),
                    description: 'Shipment information received',
                    icon: 'pi-file',
                    completed: true
                },
                {
                    status: 'Picked Up',
                    location: 'Seattle Distribution Center',
                    timestamp: new Date('2025-10-25T16:20:00'),
                    description: 'Package picked up by carrier',
                    icon: 'pi-truck',
                    completed: true
                },
                {
                    status: 'In Transit',
                    location: 'Salt Lake City, UT',
                    timestamp: new Date('2025-10-26T11:30:00'),
                    description: 'Package in transit',
                    icon: 'pi-box',
                    completed: true
                },
                {
                    status: 'In Transit',
                    location: 'Memphis, TN Hub',
                    timestamp: new Date('2025-10-27T19:15:00'),
                    description: 'Arrived at regional hub',
                    icon: 'pi-building',
                    completed: true
                },
                {
                    status: 'Out for Delivery',
                    location: 'Miami, FL',
                    timestamp: new Date('2025-10-29T08:00:00'),
                    description: 'Out for delivery',
                    icon: 'pi-send',
                    completed: true
                },
                {
                    status: 'Delivered',
                    location: 'Miami, FL 33101',
                    timestamp: new Date('2025-10-29T15:45:00'),
                    description: 'Delivered and signed for',
                    icon: 'pi-check-circle',
                    completed: true
                }
            ]
        },
        'TRK-2025-009012': {
            trackingNumber: 'TRK-2025-009012',
            carrier: 'DHL Express',
            service: '2-Day Shipping',
            status: 'pending',
            origin: 'Chicago, IL 60601',
            destination: 'Boston, MA 02101',
            shippedDate: new Date('2025-10-30'),
            estimatedDelivery: new Date('2025-11-01'),
            weight: 1.8,
            dimensions: '25 x 20 x 10 cm',
            items: [
                { sku: 'BOOK-2024-789', name: 'Technical Manual Set', quantity: 3, weight: 1.5, price: 89.99 },
                { sku: 'STAT-2024-456', name: 'Premium Notebook', quantity: 5, weight: 0.3, price: 12.99 }
            ],
            events: [
                {
                    status: 'Order Placed',
                    location: 'Chicago, IL',
                    timestamp: new Date('2025-10-30T07:30:00'),
                    description: 'Label created, awaiting pickup',
                    icon: 'pi-file',
                    completed: true
                },
                {
                    status: 'Picked Up',
                    location: 'Chicago Distribution Center',
                    timestamp: new Date(),
                    description: 'Scheduled for pickup',
                    icon: 'pi-truck',
                    completed: false
                },
                {
                    status: 'In Transit',
                    location: 'En route',
                    timestamp: new Date(),
                    description: 'Package will be in transit',
                    icon: 'pi-box',
                    completed: false
                },
                {
                    status: 'Out for Delivery',
                    location: 'Boston, MA',
                    timestamp: new Date(),
                    description: 'Package will be out for delivery',
                    icon: 'pi-send',
                    completed: false
                },
                {
                    status: 'Delivered',
                    location: 'Boston, MA 02101',
                    timestamp: new Date(),
                    description: 'Package will be delivered',
                    icon: 'pi-check-circle',
                    completed: false
                }
            ]
        }
    };

    ngOnInit() {}

    trackShipment() {
        if (!this.trackingNumber.trim()) {
            this.error = 'Please enter a tracking number';
            return;
        }

        this.loading = true;
        this.error = '';
        this.shipment = null;

        setTimeout(() => {
            const found = this.shipmentDatabase[this.trackingNumber.toUpperCase()];

            if (found) {
                this.shipment = found;
                this.error = '';
            } else {
                this.error = `Tracking number "${this.trackingNumber}" not found. Please verify and try again.`;
            }

            this.loading = false;
        }, 1200);
    }

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            pending: 'Pending Pickup',
            'in-transit': 'In Transit',
            'out-for-delivery': 'Out for Delivery',
            delivered: 'Delivered',
            exception: 'Exception'
        };
        return labels[status] || status;
    }

    getStatusSeverity(status: string): string {
        const severities: { [key: string]: string } = {
            pending: 'warning',
            'in-transit': 'info',
            'out-for-delivery': 'warning',
            delivered: 'success',
            exception: 'danger'
        };
        return severities[status] || 'info';
    }

    getCurrentEventIndex(): number {
        if (!this.shipment) return -1;
        return this.shipment.events.findIndex((trackingEvent: ShipmentTrackingEvent) => !trackingEvent.completed);
    }

    getTotalValue(): string {
        if (!this.shipment) return '0.00';
        const total = this.shipment.items.reduce((sum: number, item: ShipmentItem) => sum + item.price * item.quantity, 0);
        return total.toFixed(2);
    }

    copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }
}
