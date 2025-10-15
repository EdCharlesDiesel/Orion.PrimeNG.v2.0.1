import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import { ServerMessageModel } from '../../../../core/models/server-message.model';
import { UserModel } from '../../../../core/models/user.model';
import { VideoSourceUpdateModel } from '../../../../core/models/video-source-update.model';
import { AttachmentModel, RichMessageModel } from '../../../../core/models/rich-message.model';
import { LinkifyPipe } from '../../../../utility/linkify.pipe';
import { MessageAttachmentComponent } from '../message-attachment/message-attachment.component';
import { CommonModule, DatePipe } from '@angular/common';



@Component({
    selector: 'app-message-entry',
    templateUrl: './message-entry.component.html',
    imports: [LinkifyPipe, MessageAttachmentComponent, DatePipe,CommonModule],
    styleUrls: ['./message-entry.component.scss']
})
export class MessageEntryComponent implements OnInit {
    @Input() message!: ServerMessageModel;
    @Input() thumbsUrl!: string;
    @Input() principal!: UserModel;
    @Input() videoSourceUpdates$!: Observable<VideoSourceUpdateModel>;
    @Output() attachmentRequest: EventEmitter<AttachmentModel> = new EventEmitter();

    richMessage!: RichMessageModel | null;
    isSelfMessage!: boolean;
    isInfo!: boolean;

    constructor() {}

    ngOnInit(): void {
        this.richMessage = this.message.type === 'richMsg' ? (JSON.parse(this.message.payload) as RichMessageModel) : null;
        const client = this.message.client;
        this.isSelfMessage = client && client.clientId === this.principal.id;
        this.isInfo = this.message.type === 'info';
    }
}
