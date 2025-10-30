export interface Shipment {
    trackingNumber: string;
    carrier: string;
    service: string;
    status: string;
    origin: string;
    destination: string;
    shippedDate: Date;
    estimatedDelivery: Date;
    actualDelivery?: Date;
    weight: number;
    dimensions: string;
    items: ShipmentItem[];
    events: ShipmentTrackingEvent[];
    signature?: string;
}

export interface ShipmentItem {
    sku: string;
    name: string;
    quantity: number;
    weight: number;
    price: number;
}

export interface ShipmentTrackingEvent {
    status: string;
    location: string;
    timestamp: Date;
    description: string;
    icon: string;
    completed: boolean;
}

