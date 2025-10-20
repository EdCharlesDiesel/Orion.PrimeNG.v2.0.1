import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CheckOutComponent } from '../../features/components/check-out/check-out.component';
import { ChatComponent } from '../../features/components/chat/chat.component';
import { Card } from 'primeng/card';
import { CalendarComponent } from '../../features/components/calendar/calendar.component';

@Component({
    selector: 'app-calendar-page',
    standalone: true,
    imports: [Card, CalendarComponent],
    template: `
        <p-card>
            <app-calendar></app-calendar>
        </p-card>
    `
})
export class CalendarPage {}
