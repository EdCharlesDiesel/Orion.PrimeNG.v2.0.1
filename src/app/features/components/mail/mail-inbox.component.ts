import { Component, computed, OnInit, signal } from '@angular/core';
import { MessageService, MenuItem } from 'primeng/api';
import { Mail } from '../../../core/models/mail.model';
import { MailService } from '../../../service/mail.service';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DatePipe, NgClass } from '@angular/common';
import { TabMenu } from 'primeng/tabmenu';

@Component({
    selector: 'app-mail-inbox',
    standalone: true,
    imports: [Toast, Toolbar, Button, TableModule, NgClass, DatePipe, TabMenu],
    providers: [MessageService],
    templateUrl: './mail-inbox.component.html',
    styleUrls: ['./mail-inbox.component.scss']
})
export class MailInboxComponent implements OnInit {
    mails: Mail[] = [];
    selectedMail: Mail | null = null;
    folders = signal(['Inbox', 'Sent', 'Trash']);
    activeFolder = signal('Inbox');

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

    menuItems = computed(() => {
        return this.folders().map(
            (f) =>
                ({
                    label: f,
                    command: () => this.switchFolder(f),
                    data: f
                }) as MenuItem
        );
    });

    activeMenuItem = computed(() => {
        return this.menuItems().find((item) => item['data'] === this.activeFolder());
    });
}
