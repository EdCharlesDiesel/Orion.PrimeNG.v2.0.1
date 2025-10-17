import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CheckOutComponent } from '../../features/components/check-out/check-out.component';
import { ChatComponent } from '../../features/components/chat/chat.component';
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
