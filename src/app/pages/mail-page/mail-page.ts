import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { MailInboxComponent } from '../../features/components/mail/mail-inbox.component';

@Component({
    selector: 'app-mail-page',
    standalone: true,
    imports: [Card, MailInboxComponent],
    template: `
        <p-card>
            <app-mail-inbox></app-mail-inbox>
        </p-card>
    `
})
export class MailPage {}
