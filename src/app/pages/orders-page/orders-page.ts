import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CheckOutComponent } from '../../features/components/check-out/check-out.component';
import { ChatComponent } from '../../features/components/chat/chat.component';
import { Card } from 'primeng/card';
import { MailInboxComponent } from '../../features/components/mail/mail-inbox.component';
import { NotificationsComponent } from '../../features/components/notifications/notifications.component';
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
