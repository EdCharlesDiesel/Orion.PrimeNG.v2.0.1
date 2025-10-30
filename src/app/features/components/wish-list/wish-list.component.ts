// wish-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { WishListItem } from '../../../core/models/wish-list-item.model';


@Component({
    selector: 'app-wish-list',
    templateUrl: './wish-list.component.html',
    styleUrls: ['./wish-list.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CardModule, DialogModule,
        InputTextModule, TextareaModule, DropdownModule, TagModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService]
})
export class WishListComponent implements OnInit {
    wishListItems: WishListItem[] = [];
    displayDialog: boolean = false;
    selectedItem: WishListItem = this.initializeNewItem();

    // Priority options for dropdown
    priorityOptions = [
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' }
    ];

    // Category options
    categoryOptions = ['Electronics', 'Books', 'Clothing', 'Home & Garden', 'Toys & Games', 'Sports & Outdoors', 'Beauty & Personal Care', 'Other'];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        // Load wishlist from localStorage or initialize with sample data
        this.loadWishList();
    }

    initializeNewItem(): WishListItem {
        return {
            id: Date.now(),
            title: '',
            description: '',
            price: undefined,
            priority: 'Medium',
            category: 'Other',
            url: '',
            addedDate: new Date(),
            isPurchased: false
        };
    }

    loadWishList() {
        const savedWishList = localStorage.getItem('wishList');
        if (savedWishList) {
            this.wishListItems = JSON.parse(savedWishList);
        } else {
            // Sample data
            this.wishListItems = [
                {
                    id: 1,
                    title: 'Wireless Headphones',
                    description: 'Noise cancelling wireless headphones',
                    price: 199.99,
                    priority: 'High',
                    category: 'Electronics',
                    addedDate: new Date('2024-01-15'),
                    isPurchased: false
                },
                {
                    id: 2,
                    title: 'Programming Book',
                    description: 'Latest Angular development guide',
                    price: 45.99,
                    priority: 'Medium',
                    category: 'Books',
                    addedDate: new Date('2024-01-10'),
                    isPurchased: false
                }
            ];
            this.saveWishList();
        }
    }

    saveWishList() {
        localStorage.setItem('wishList', JSON.stringify(this.wishListItems));
    }

    showAddDialog() {
        this.selectedItem = this.initializeNewItem();
        this.displayDialog = true;
    }

    showEditDialog(item: WishListItem) {
        this.selectedItem = { ...item };
        this.displayDialog = true;
    }

    saveItem() {
        if (!this.selectedItem.title.trim()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Title is required'
            });
            return;
        }

        if (this.selectedItem.id === this.initializeNewItem().id) {
            // New item
            this.wishListItems.push(this.selectedItem);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Item added to wishlist'
            });
        } else {
            // Update existing item
            const index = this.wishListItems.findIndex((item) => item.id === this.selectedItem.id);
            if (index !== -1) {
                this.wishListItems[index] = { ...this.selectedItem };
            }
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Item updated successfully'
            });
        }

        this.saveWishList();
        this.displayDialog = false;
    }

    deleteItem(item: WishListItem) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this item?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.wishListItems = this.wishListItems.filter((i) => i.id !== item.id);
                this.saveWishList();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Item deleted successfully'
                });
            }
        });
    }

    togglePurchased(item: WishListItem) {
        item.isPurchased = !item.isPurchased;
        this.saveWishList();
        const action = item.isPurchased ? 'marked as purchased' : 'marked as not purchased';
        this.messageService.add({
            severity: 'info',
            summary: 'Updated',
            detail: `Item ${action}`
        });
    }

    getPrioritySeverity(priority: string): any {
        switch (priority) {
            case 'High':
                return 'danger';
            case 'Medium':
                return 'warning';
            case 'Low':
                return 'success';
            default:
                return 'info';
        }
    }

    getTotalValue(): number {
        return this.wishListItems.filter((item) => !item.isPurchased && item.price).reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getPurchasedCount(): number {
        return this.wishListItems.filter((item) => item.isPurchased).length;
    }

    getItemsByPriority(priority: string): WishListItem[] {
        return this.wishListItems.filter((item) => item.priority === priority && !item.isPurchased);
    }
}
