import { IProduct } from './product';

export interface SpecialProduct extends IProduct{
    id: number;
    name: string;
    description: string;
    originalPrice: number;
    discountPrice: number;
    discountPercentage: number;
    category: string;
    imageUrl: string;
    isFeatured: boolean;
    tags: string[];
    availableUntil: Date;
    stock: number;
    rating: number;
    reviewCount: number;
    isNew: boolean;
}
