export interface WishListItem {
    id: number;
    title: string;
    description: string;
    price?: number;
    priority: 'Low' | 'Medium' | 'High';
    category: string;
    url?: string;
    imageUrl?: string;
    addedDate: Date;
    isPurchased: boolean;
    notes?: string;
}
