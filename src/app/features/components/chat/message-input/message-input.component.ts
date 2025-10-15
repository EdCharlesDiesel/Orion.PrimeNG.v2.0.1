import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-message-input',
    template: `
    <div class="message-input-container">
      <div class="p-inputgroup">
        <input
          type="text"
          pInputText
          [(ngModel)]="messageText"
          (keyup.enter)="send()"
          (input)="onTyping()"
          placeholder="Type a message..."
        >
        <p-fileUpload
          mode="basic"
          chooseIcon="pi pi-paperclip"
          [auto]="false"
          [multiple]="true"
          accept="image/*,video/*,.pdf,.doc,.docx"
          (onSelect)="onFileSelect($event)"
          #fileUpload>
        </p-fileUpload>
        <button
          pButton
          pRipple
          type="button"
          icon="pi pi-send"
          class="p-button-primary"
          (click)="send()"
          [disabled]="!messageText?.trim() && selectedFiles.length === 0">
        </button>
      </div>

      <div class="selected-files" *ngIf="selectedFiles.length > 0">
        <div class="file-chip" *ngFor="let file of selectedFiles; let i = index">
          <span>{{ file.name }}</span>
          <i class="pi pi-times" (click)="removeFile(i)"></i>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .message-input-container {
      width: 100%;
    }

    .selected-files {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .file-chip {
      background: var(--primary-color);
      color: var(--primary-color-text);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;

      i {
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  `]
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
