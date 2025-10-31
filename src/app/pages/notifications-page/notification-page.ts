import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { NotificationsComponent } from '../../features/components/notifications/notifications.component';

@Component({
    selector: 'app-notification-page',
    standalone: true,
    imports: [Card, NotificationsComponent],
    template: `
        <p-card>
            <app-notifications></app-notifications>
        </p-card>
    `
})
export class NotificationPage {}
