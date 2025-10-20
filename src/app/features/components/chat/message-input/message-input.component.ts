import { Component, Output, EventEmitter } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { NgForOf, NgIf } from '@angular/common';

@Component({
    selector: 'app-message-input',
    templateUrl: 'message-input.component.html',
    imports: [FileUpload, FormsModule, InputText, ButtonDirective, Ripple, NgIf, NgForOf],
    styleUrl: 'message-input.component.scss'
})
export class MessageInputComponent {
    @Output() newMessage = new EventEmitter<any>();
    @Output() userTyping = new EventEmitter<void>();

    messageText = '';
    selectedFiles: File[] = [];

    onTyping() {
        this.userTyping.emit();
    }

    onFileSelect(event: any) {
        this.selectedFiles = [...this.selectedFiles, ...event.files];
    }

    removeFile(index: number) {
        this.selectedFiles.splice(index, 1);
    }

    send() {
        if (this.messageText.trim() || this.selectedFiles.length > 0) {
            this.newMessage.emit({
                text: this.messageText,
                files: this.selectedFiles,
                type: this.selectedFiles.length > 0 ? 'file' : 'text'
            });
            this.messageText = '';
            this.selectedFiles = [];
        }
    }
}
