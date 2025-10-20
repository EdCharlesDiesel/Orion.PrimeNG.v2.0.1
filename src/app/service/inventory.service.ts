import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private readonly STORAGE_KEY = 'product_inventory';

    // Generate random initial quantities
    public generateInitialQuantities(productIds: (number | undefined)[]): { [p: number]: number } {
        const quantities: { [productId: number]: number } = {};
        productIds.forEach((id: any) => {
            quantities[id] = Math.floor(Math.random() * 50) + 10; // Random between 10-59
        });
        return quantities;
    }

    // Save quantities to localStorage
    public saveQuantities(quantities: { [productId: number]: number }): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(quantities));
        } catch (error) {
            console.error('Failed to save inventory:', error);
        }
    }

    // Load quantities from localStorage
    public loadQuantities(): { [productId: number]: number } | null {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load inventory:', error);
            return null;
        }
    }

    // Clear stored quantities
    public clearQuantities(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
