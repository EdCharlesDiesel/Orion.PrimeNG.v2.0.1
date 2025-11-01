import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { CalendarEvent, CalendarService } from '../../../service/calendar.service';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FullCalendarModule, DialogModule, InputTextModule, ButtonModule, ToastModule, FormsModule, NgOptimizedImage],
    providers: [MessageService],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    private calendarEvents: CalendarEvent[] = [
        { id: 1, title: 'Team Standup', start: new Date().toISOString(), color: '#42A5F5' },
        { id: 2, title: 'Client Meeting', start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), color: '#66BB6A' }
    ];
    calendarOptions: CalendarOptions = {};
    displayDialog = false;
    newEventTitle = '';
    selectedDate: string | null = null;

    constructor(
        private calendarService: CalendarService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.calendarService.events$.subscribe((events) => {
            this.calendarEvents = events;
            this.initCalendarOptions();
        });
    }

    initCalendarOptions() {
        this.calendarOptions = {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            editable: false,
            selectable: true,
            // events: this.calendarEvents,
            dateClick: (info) => this.onDateClick(info),
            eventClick: (info) => this.onEventClick(info)
        };
    }

    onDateClick(info: any) {
        this.newEventTitle = '';
        this.displayDialog = true;
        this.selectedDate = info.dateStr;
    }

    saveEvent() {
        if (!this.newEventTitle.trim()) return;
        this.calendarService.addEvent({
            id: 0,
            title: this.newEventTitle,
            start: this.selectedDate!,
            color: '#42A5F5'
        });

        this.messageService.add({
            severity: 'success',
            summary: 'Event Added',
            detail: this.newEventTitle
        });

        this.displayDialog = false;
    }

    onEventClick(info: any) {
        this.calendarService.deleteEvent(Number(info.event.id));
        this.messageService.add({
            severity: 'warn',
            summary: 'Event Deleted',
            detail: info.event.title
        });
    }
}
