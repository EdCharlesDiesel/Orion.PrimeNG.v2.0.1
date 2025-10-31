import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { OrdersComponent } from '../../features/components/orders/orders.component';

@Component({
    selector: 'app-orders-page',
    standalone: true,
    imports: [Card, OrdersComponent],
    template: `
        <p-card>
            <app-orders></app-orders>
        </p-card>
    `
})
export class OrdersPage {}
