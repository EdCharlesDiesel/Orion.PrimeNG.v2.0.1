export interface User {
    id: string;
    nick: string;
    isTyping: boolean;
    isOnline: boolean;
}

export interface Message {
    id: string;
    userId: string;
    nick: string;
    text: string;
    timestamp: Date;
    attachments?: Attachment[];
    type: 'text' | 'image' | 'video' | 'file';
}

export interface Attachment {
    id: number;
    fileName: string;
    originalName: string;
    contentType: string;
    size: number;
    url?: string;
}

export interface ChatState {
    principal: User | null;
    users: User[];
    messages: Message[];
    loading: boolean;
    error: string | null;
    uploadProgress: number | null;
    fixedScroll: boolean;
    videoSourceUpdates: { [messageId: string]: string };
}

export const initialState: ChatState = {
    principal: null,
    users: [],
    messages: [],
    loading: false,
    error: null,
    uploadProgress: null,
    fixedScroll: false,
    videoSourceUpdates: {}
};
