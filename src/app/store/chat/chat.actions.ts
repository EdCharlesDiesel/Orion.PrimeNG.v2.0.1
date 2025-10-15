import { createAction, props } from '@ngrx/store';

// User Actions
export const setNick = createAction(
    '[Chat] Set Nick',
    props<{ nick: string }>()
);

export const loadUsers = createAction('[Chat] Load Users');

export const loadUsersSuccess = createAction(
    '[Chat] Load Users Success',
    props<{ users: any[] }>()
);

export const userTyping = createAction(
    '[Chat] User Typing',
    props<{ userId: string; isTyping: boolean }>()
);

// Message Actions
export const loadMessages = createAction('[Chat] Load Messages');

export const loadMessagesSuccess = createAction(
    '[Chat] Load Messages Success',
    props<{ messages: any[] }>()
);

export const sendMessage = createAction(
    '[Chat] Send Message',
    props<{ message: any }>()
);

export const sendMessageSuccess = createAction(
    '[Chat] Send Message Success',
    props<{ message: any }>()
);

export const sendMessageFailure = createAction(
    '[Chat] Send Message Failure',
    props<{ error: string }>()
);

export const receiveMessage = createAction(
    '[Chat] Receive Message',
    props<{ message: any }>()
);

// Attachment Actions
export const uploadAttachment = createAction(
    '[Chat] Upload Attachment',
    props<{ file: File; messageId?: string }>()
);

export const uploadAttachmentProgress = createAction(
    '[Chat] Upload Attachment Progress',
    props<{ progress: number }>()
);

export const uploadAttachmentSuccess = createAction(
    '[Chat] Upload Attachment Success',
    props<{ attachment: any }>()
);

export const uploadAttachmentFailure = createAction(
    '[Chat] Upload Attachment Failure',
    props<{ error: string }>()
);

export const downloadAttachment = createAction(
    '[Chat] Download Attachment',
    props<{ attachmentId: number }>()
);

export const deleteMessage = createAction(
    '[Chat] Delete Message',
    props<{ messageId: string }>()
);

export const updateVideoSource = createAction(
    '[Chat] Update Video Source',
    props<{ messageId: string; source: string }>()
);
