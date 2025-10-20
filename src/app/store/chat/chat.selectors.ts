import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from './chat.state';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectPrincipal = createSelector(
    selectChatState,
    (state) => state.principal
);

export const selectUsers = createSelector(
    selectChatState,
    (state) => state.users
);

export const selectMessages = createSelector(
    selectChatState,
    (state) => state.messages
);

export const selectLoading = createSelector(
    selectChatState,
    (state) => state.loading
);

export const selectUploadProgress = createSelector(
    selectChatState,
    (state) => state.uploadProgress
);

export const selectVideoSourceUpdates = createSelector(
    selectChatState,
    (state) => state.videoSourceUpdates
);

export const selectFixedScroll = createSelector(
    selectChatState,
    (state) => state.fixedScroll
);
