import { Component } from '@angular/core';
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
