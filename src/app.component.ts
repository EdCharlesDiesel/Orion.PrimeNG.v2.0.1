import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Toast } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';
import { SubscriptionService } from './app/service/subscription.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, Toast],
    template: `<router-outlet></router-outlet><p-toast position="top-right"></p-toast>`,
    providers: [MessageService]
})
export class AppComponent {

    constructor(
        private messageService: MessageService) {

    }
}
