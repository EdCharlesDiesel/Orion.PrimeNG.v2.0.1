import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MessageService, MenuItem } from 'primeng/api';
import * as ChatActions from '../../../store/chat/chat.actions';
import * as ChatSelectors from '../../../store/chat/chat.selectors';
import { ProgressBar } from 'primeng/progressbar';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MessageInputComponent } from './message-input/message-input.component';
import { MessageEntryComponent } from './message-entry/message-entry.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Tooltip } from 'primeng/tooltip';
import { Toast } from 'primeng/toast';
import { Menu } from 'primeng/menu';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    imports: [ProgressBar, NgIf, MessageInputComponent, MessageEntryComponent, NgForOf, ButtonDirective, Ripple, Tooltip, NgClass, Toast, Menu, FormsModule, InputText],
    providers: [MessageService]
})
export class ChatComponent implements OnInit, OnDestroy {
    @ViewChild('messagesScroll') messagesScroll!: ElementRef;

    nick = 'Anonymous';
    nickChanged = new Subject<string>();

    users$: Observable<any[]>;
    messages$: Observable<any[]>;
    principal$: Observable<any>;
    progress$: Observable<number | null>;
    videoSourceUpdates$: Observable<any>;

    users: any[] = [];
    messages: any[] = [];
    principal: any;
    progress: number | null = null;
    fixedScroll = false;

    thumbsUrl = 'http://localhost:5000/api/attachments';

    cornerMenuItems: MenuItem[] = [
        {
            label: 'Clear Messages',
            icon: 'pi pi-trash',
            command: () => this.clearMessages()
        },
        {
            label: 'Export Chat',
            icon: 'pi pi-download',
            command: () => this.exportChat()
        },
        {
            separator: true
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: () => this.openSettings()
        }
    ];

    constructor(
        private store: Store,
        private messageService: MessageService
    ) {
        this.users$ = this.store.select(ChatSelectors.selectUsers);
        this.messages$ = this.store.select(ChatSelectors.selectMessages);
        this.principal$ = this.store.select(ChatSelectors.selectPrincipal);
        this.progress$ = this.store.select(ChatSelectors.selectUploadProgress);
        this.videoSourceUpdates$ = this.store.select(ChatSelectors.selectVideoSourceUpdates);
    }

    ngOnInit() {
        // Load initial data
        this.store.dispatch(ChatActions.loadMessages());
        this.store.dispatch(ChatActions.loadUsers());

        // Subscribe to observables
        this.users$.subscribe((users) => (this.users = users));
        this.messages$.subscribe((messages) => {
            this.messages = messages;
            setTimeout(() => this.scrollToBottom(false), 100);
        });
        this.principal$.subscribe((principal) => (this.principal = principal));
        this.progress$.subscribe((progress) => (this.progress = progress));

        // Handle nick changes with debounce
        this.nickChanged.pipe(debounceTime(500)).subscribe((nick) => {
            this.store.dispatch(ChatActions.setNick({ nick }));
        });

        // Initialize principal user
        this.store.dispatch(ChatActions.setNick({ nick: this.nick }));
    }

    ngOnDestroy() {
        this.nickChanged.complete();
    }

    sendMessage(messageData: any) {
        const message = {
            id: Date.now().toString(),
            userId: this.principal?.id || 'user-' + Date.now(),
            nick: this.nick,
            text: messageData.text,
            timestamp: new Date(),
            attachments: messageData.attachments || [],
            type: messageData.type || 'text'
        };

        this.store.dispatch(ChatActions.sendMessage({ message }));

        // Handle file uploads if any
        if (messageData.files && messageData.files.length > 0) {
            messageData.files.forEach((file: File) => {
                this.store.dispatch(ChatActions.uploadAttachment({ file, messageId: message.id }));
            });
        }

        this.scrollToBottom(true);
    }

    userTyping() {
        if (this.principal) {
            this.store.dispatch(
                ChatActions.userTyping({
                    userId: this.principal.id,
                    isTyping: true
                })
            );

            // Reset typing indicator after 3 seconds
            setTimeout(() => {
                this.store.dispatch(
                    ChatActions.userTyping({
                        userId: this.principal.id,
                        isTyping: false
                    })
                );
            }, 3000);
        }
    }

    downloadAttachment(attachmentId: any) {
        this.store.dispatch(ChatActions.downloadAttachment({ attachmentId }));
    }

    scrollToBottom(smooth: boolean) {
        if (this.messagesScroll) {
            const element = this.messagesScroll.nativeElement;
            element.scrollTo({
                top: element.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
            this.fixedScroll = false;
        }
    }

    onScroll() {
        if (this.messagesScroll) {
            const element = this.messagesScroll.nativeElement;
            const scrollTop = element.scrollTop;
            const scrollHeight = element.scrollHeight;
            const clientHeight = element.clientHeight;

            // Show scroll button if not at bottom
            this.fixedScroll = scrollTop + clientHeight < scrollHeight - 100;
        }
    }

    clearMessages() {
        this.messageService.add({
            severity: 'info',
            summary: 'Cleared',
            detail: 'All messages have been cleared',
            key: 'toast'
        });
    }

    exportChat() {
        const chatData = JSON.stringify(this.messages, null, 2);
        const blob = new Blob([chatData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chat-export-${Date.now()}.json`;
        link.click();
        window.URL.revokeObjectURL(url);

        this.messageService.add({
            severity: 'success',
            summary: 'Exported',
            detail: 'Chat exported successfully',
            key: 'toast'
        });
    }

    openSettings() {
        this.messageService.add({
            severity: 'info',
            summary: 'Settings',
            detail: 'Settings dialog would open here',
            key: 'toast'
        });
    }
}
