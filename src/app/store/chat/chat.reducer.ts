import { createReducer, on } from '@ngrx/store';
import * as ChatActions from './chat.actions';
import { initialState } from './chat.state';

export const chatReducer = createReducer(
    initialState,
    on(ChatActions.setNick, (state, { nick }) => ({
        ...state,
        principal: { ...state.principal!, nick }
    })),
    on(ChatActions.loadUsersSuccess, (state, { users }) => ({
        ...state,
        users
    })),
    on(ChatActions.userTyping, (state, { userId, isTyping }) => ({
        ...state,
        users: state.users.map(user =>
            user.id === userId ? { ...user, isTyping } : user
        )
    })),
    on(ChatActions.loadMessages, (state) => ({
        ...state,
        loading: true
    })),
    on(ChatActions.loadMessagesSuccess, (state, { messages }) => ({
        ...state,
        loading: false,
        messages
    })),
    on(ChatActions.sendMessage, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ChatActions.sendMessageSuccess, (state, { message }) => ({
        ...state,
        loading: false,
        messages: [...state.messages, message]
    })),
    on(ChatActions.sendMessageFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(ChatActions.receiveMessage, (state, { message }) => ({
        ...state,
        messages: [...state.messages, message]
    })),
    on(ChatActions.uploadAttachmentProgress, (state, { progress }) => ({
        ...state,
        uploadProgress: progress
    })),
    on(ChatActions.uploadAttachmentSuccess, (state) => ({
        ...state,
        uploadProgress: null
    })),
    on(ChatActions.uploadAttachmentFailure, (state, { error }) => ({
        ...state,
        uploadProgress: null,
        error
    })),
    on(ChatActions.deleteMessage, (state, { messageId }) => ({
        ...state,
        messages: state.messages.filter(m => m.id !== messageId)
    })),
    on(ChatActions.updateVideoSource, (state, { messageId, source }) => ({
        ...state,
        videoSourceUpdates: {
            ...state.videoSourceUpdates,
            [messageId]: source
        }
    }))
);
