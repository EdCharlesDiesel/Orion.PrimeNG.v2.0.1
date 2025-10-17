export interface Mail {
    id: number;
    sender: string;
    subject: string;
    content: string;
    date: Date;
    read: boolean;
    folder: 'Inbox' | 'Sent' | 'Trash';
}
