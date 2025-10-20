import { Injectable } from '@angular/core';
import { Mail } from '../core/models/mail.model';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class MailService {
    private mails: Mail[] = [
        { id: 1, sender: 'support@primeng.io', subject: 'Welcome to PrimeNG', content: 'Thank you for joining PrimeNG!', date: new Date(), read: false, folder: 'Inbox' },
        { id: 2, sender: 'me@example.com', subject: 'Meeting follow-up', content: 'Let’s review our meeting notes.', date: new Date(), read: true, folder: 'Sent' },
        { id: 3, sender: 'no-reply@system.com', subject: 'System update', content: 'Scheduled maintenance tonight.', date: new Date(), read: false, folder: 'Inbox' },
    ];

    private mailSubject = new BehaviorSubject<Mail[]>(this.mails);

    getMails(): Observable<Mail[]> {
        return this.mailSubject.asObservable();
    }

    moveToTrash(id: number): void {
        const mail = this.mails.find(m => m.id === id);
        if (mail) {
            mail.folder = 'Trash';
            this.mailSubject.next(this.mails);
        }
    }

    markAsRead(id: number): void {
        const mail = this.mails.find(m => m.id === id);
        if (mail) {
            mail.read = true;
            this.mailSubject.next(this.mails);
        }
    }

    getByFolder(folder: string): Mail[] {
        return this.mails.filter(m => m.folder === folder);
    }
}
