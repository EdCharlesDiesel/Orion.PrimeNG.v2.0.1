import { Component, OnInit, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Mail } from '../../../core/models/mail.model';
import { MailService } from '../../../service/mail.service';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { TabMenu } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { DatePipe, NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-mail-inbox',
    standalone: true,
    imports: [Toast, Toolbar, Button, TabMenu, TableModule, NgClass, DatePipe, NgIf],
    providers: [MessageService],
    templateUrl: './mail-inbox.component.html',
    styleUrls: ['./mail-inbox.component.scss']
})
export class MailInboxComponent implements OnInit {
    mails: Mail[] = [];
    selectedMail: Mail | null = null;
    folders = ['Inbox', 'Sent', 'Trash'];
    activeFolder = signal('Inbox');
    f: any;

    constructor(
        private mailService: MailService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadMails();
    }

    loadMails(): void {
        this.mailService.getMails().subscribe((all) => {
            this.mails = all.filter((m) => m.folder === this.activeFolder());
        });
    }

    openMail(mail: any): void {
        this.selectedMail = mail;
        this.mailService.markAsRead(mail.id);
        this.messageService.add({ severity: 'info', summary: 'Mail Opened', detail: mail.subject });
    }

    deleteMail(mail: Mail): void {
        this.mailService.moveToTrash(mail.id);
        this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: `${mail.subject} moved to Trash` });
        this.loadMails();
    }

    switchFolder(folder: string): void {
        this.activeFolder.set(folder);
        this.selectedMail = null;
        this.loadMails();
    }

    getUnreadCount(): number {
        return this.mails.filter((m) => !m.read).length;
    }
}
