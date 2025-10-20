import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CheckOutComponent } from '../../features/components/check-out/check-out.component';
import { ChatComponent } from '../../features/components/chat/chat.component';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-chat-page',
    standalone: true,
    imports: [ChatComponent, Card],
    template: `
        <p-card>
            <app-chat></app-chat>
        </p-card>
    `
})
export class ChatPage {}
