export interface OrderItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    category: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    orderDate: Date;
    status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: {
        fullName: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
}
