import { Component } from '@angular/core';
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
