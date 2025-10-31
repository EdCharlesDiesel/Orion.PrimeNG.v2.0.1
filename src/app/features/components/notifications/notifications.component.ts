import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { ScrollPanel } from 'primeng/scrollpanel';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Tooltip } from 'primeng/tooltip';

export interface Notification {
    id: number;
    type: 'order' | 'cart' | 'system' | 'message' | 'alert';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    icon: string;
    iconColor: string;
    link?: string;
    image?: string;
}

export interface CartNotification extends Notification {
    type: 'cart';
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
}

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule, FormsModule, Badge, Button, Card, Avatar, TabsModule, Tag, ScrollPanel, InputText, IconField, InputIcon, Tooltip],
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
    notifications = signal<Notification[]>([]);
    selectedTab = signal<string>('all');
    searchQuery = signal<string>('');

    // Computed values
    unreadCount = computed(() => {
        return this.notifications().filter((n) => !n.read).length;
    });

    cartNotificationsCount = computed(() => {
        return this.filteredNotifications('cart').filter((n) => !n.read).length;
    });

    orderNotificationsCount = computed(() => {
        return this.filteredNotifications('order').filter((n) => !n.read).length;
    });

    systemNotificationsCount = computed(() => {
        return this.filteredNotifications('system').filter((n) => !n.read).length;
    });

    messageNotificationsCount = computed(() => {
        return this.filteredNotifications('message').filter((n) => !n.read).length;
    });

    displayedNotifications = computed(() => {
        const tab = this.selectedTab();
        const query = this.searchQuery().toLowerCase();

        let filtered = tab === 'all' ? this.notifications() : this.notifications().filter((n) => n.type === tab);

        if (query) {
            filtered = filtered.filter((n) => n.title.toLowerCase().includes(query) || n.message.toLowerCase().includes(query));
        }

        return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });

    ngOnInit(): void {
        this.loadNotifications();
    }

    loadNotifications(): void {
        const mockNotifications: Notification[] = [
            {
                id: 1,
                type: 'cart',
                title: 'Item Added to Cart',
                message: 'MacBook Pro 16" added to your cart',
                timestamp: new Date(Date.now() - 5 * 60000),
                read: false,
                icon: 'pi-shopping-cart',
                iconColor: '#10B981',
                productName: 'MacBook Pro 16"',
                productImage: 'https://via.placeholder.com/50',
                price: 2499.99,
                quantity: 1
            } as CartNotification,
            {
                id: 2,
                type: 'order',
                title: 'Order Shipped',
                message: 'Your order #12345 has been shipped',
                timestamp: new Date(Date.now() - 30 * 60000),
                read: false,
                icon: 'pi-box',
                iconColor: '#3B82F6',
                link: '/orders/12345'
            },
            {
                id: 3,
                type: 'cart',
                title: 'Price Drop Alert',
                message: 'iPhone 15 Pro is now $100 cheaper!',
                timestamp: new Date(Date.now() - 60 * 60000),
                read: false,
                icon: 'pi-tag',
                iconColor: '#F59E0B',
                productName: 'iPhone 15 Pro',
                productImage: 'https://via.placeholder.com/50',
                price: 999.99,
                quantity: 1
            } as CartNotification,
            {
                id: 4,
                type: 'system',
                title: 'System Update',
                message: 'New features are available. Update now!',
                timestamp: new Date(Date.now() - 2 * 60 * 60000),
                read: true,
                icon: 'pi-cog',
                iconColor: '#6366F1'
            },
            {
                id: 5,
                type: 'message',
                title: 'New Message',
                message: 'John Doe sent you a message',
                timestamp: new Date(Date.now() - 3 * 60 * 60000),
                read: false,
                icon: 'pi-envelope',
                iconColor: '#8B5CF6',
                image: 'https://via.placeholder.com/50'
            },
            {
                id: 6,
                type: 'order',
                title: 'Order Delivered',
                message: 'Your order #12340 has been delivered',
                timestamp: new Date(Date.now() - 24 * 60 * 60000),
                read: true,
                icon: 'pi-check-circle',
                iconColor: '#10B981',
                link: '/orders/12340'
            },
            {
                id: 7,
                type: 'cart',
                title: 'Cart Reminder',
                message: 'You have 3 items waiting in your cart',
                timestamp: new Date(Date.now() - 48 * 60 * 60000),
                read: false,
                icon: 'pi-shopping-cart',
                iconColor: '#EF4444'
            },
            {
                id: 8,
                type: 'alert',
                title: 'Security Alert',
                message: 'New login detected from Chrome on Windows',
                timestamp: new Date(Date.now() - 72 * 60 * 60000),
                read: true,
                icon: 'pi-shield',
                iconColor: '#DC2626'
            }
        ];

        this.notifications.set(mockNotifications);
    }

    filteredNotifications(type: string): Notification[] {
        return this.notifications().filter((n) => n.type === type);
    }

    markAsRead(notification: Notification): void {
        this.notifications.update((notifications) => notifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
    }

    markAllAsRead(): void {
        this.notifications.update((notifications) => notifications.map((n) => ({ ...n, read: true })));
    }

    deleteNotification(notification: Notification): void {
        this.notifications.update((notifications) => notifications.filter((n) => n.id !== notification.id));
    }

    clearAll(): void {
        this.notifications.set([]);
    }

    handleNotificationClick(notification: Notification): void {
        this.markAsRead(notification);

        if (notification.link) {
            // Navigate to link
            console.log('Navigating to:', notification.link);
        }
    }

    getTimeAgo(date: Date): string {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

        const intervals: { [key: string]: number } = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [name, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return interval === 1 ? `${interval} ${name} ago` : `${interval} ${name}s ago`;
            }
        }

        return 'just now';
    }

    isCartNotification(notification: Notification): notification is CartNotification {
        return notification.type === 'cart' && 'productName' in notification;
    }

    getTagSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const severityMap: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' } = {
            cart: 'success',
            order: 'info',
            message: 'warn',
            system: 'secondary',
            alert: 'danger'
        };
        return severityMap[type] || 'secondary';
    }
}
