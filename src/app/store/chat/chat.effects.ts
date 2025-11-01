import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, mergeMap } from 'rxjs/operators';
import * as ChatActions from './chat.actions';
import { ChatService } from '../../service/chat.service';

@Injectable()
export class ChatEffects {
    loadMessages$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChatActions.loadMessages),
            switchMap(() =>
                this.chatService.getMessages().pipe(
                    map((messages) => ChatActions.loadMessagesSuccess({ messages })),
                    catchError((error) =>
                        of(ChatActions.sendMessageFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChatActions.loadUsers),
            switchMap(() =>
                this.chatService.getUsers().pipe(
                    map((users) => ChatActions.loadUsersSuccess({ users })),
                    catchError((error) => of())
                )
            )
        )
    );

    sendMessage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChatActions.sendMessage),
            switchMap(({ message }) =>
                this.chatService.sendMessage(message).pipe(
                    map((savedMessage) => ChatActions.sendMessageSuccess({ message: savedMessage })),
                    catchError((error) =>
                        of(ChatActions.sendMessageFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    uploadAttachment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChatActions.uploadAttachment),
            mergeMap(({ file, messageId }) =>
                this.chatService.uploadAttachment(file).pipe(
                    tap((event: any) => {
                        if (event.type === 'progress') {
                            // this.actions$.next(ChatActions.uploadAttachmentProgress({ progress: event.progress }));
                        }
                    }),
                    map((response: any) =>
                        ChatActions.uploadAttachmentSuccess({ attachment: response })
                    ),
                    catchError((error) =>
                        of(ChatActions.uploadAttachmentFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    downloadAttachment$ = createEffect(() =>
            this.actions$.pipe(
                ofType(ChatActions.downloadAttachment),
                tap(({ attachmentId }) => {
                    this.chatService.downloadAttachment(attachmentId);
                })
            ),
        { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private chatService: ChatService
    ) {}
}
