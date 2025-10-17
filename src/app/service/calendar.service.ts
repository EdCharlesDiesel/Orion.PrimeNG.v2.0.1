import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CalendarEvent {
    id: number;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    color?: string;
}

@Injectable({ providedIn: 'root' })
export class CalendarService {
    private events: CalendarEvent[] = [
        { id: 1, title: 'Team Standup', start: new Date().toISOString(), color: '#42A5F5' },
        { id: 2, title: 'Client Meeting', start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), color: '#66BB6A' },
    ];

    private eventSubject = new BehaviorSubject<CalendarEvent[]>(this.events);
    events$ = this.eventSubject.asObservable();

    addEvent(event: CalendarEvent) {
        event.id = this.events.length + 1;
        this.events.push(event);
        this.eventSubject.next(this.events);
    }

    deleteEvent(id: number) {
        this.events = this.events.filter(e => e.id !== id);
        this.eventSubject.next(this.events);
    }
}
