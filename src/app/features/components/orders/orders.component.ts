// orders.component.ts (updated)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Order } from '../../../core/models/order.model';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        DialogModule,
        TagModule,
        DropdownModule,
        InputTextModule,
        CalendarModule,
        TableModule,
        ToastModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class OrdersComponent implements OnInit {
    orders: Order[] = [];
    filteredOrders: Order[] = [];
    displayOrderDialog: boolean = false;
    selectedOrder: Order | null = null;

    // Filter options
    statusFilter: string = 'All';
    dateRange: Date[] | null = null;
    searchText: string = '';

    statusOptions = [
        { label: 'All Orders', value: 'All' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Confirmed', value: 'Confirmed' },
        { label: 'Shipped', value: 'Shipped' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Cancelled', value: 'Cancelled' }
    ];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        // Sample data - in real app, this would come from a service
        this.orders = [
            {
                id: '1',
                orderNumber: 'ORD-001',
                orderDate: new Date('2024-01-15'),
                status: 'Delivered',
                totalAmount: 245.99,
                paymentMethod: 'Credit Card',
                trackingNumber: 'TRK123456789',
                estimatedDelivery: new Date('2024-01-20'),
                shippingAddress: {
                    fullName: 'John Doe',
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA'
                },
                items: [
                    {
                        id: 1,
                        productName: 'Wireless Headphones',
                        price: 199.99,
                        quantity: 1,
                        category: 'Electronics',
                        imageUrl: 'assets/images/headphones.jpg'
                    },
                    {
                        id: 2,
                        productName: 'Phone Case',
                        price: 23.00,
                        quantity: 2,
                        category: 'Accessories'
                    }
                ]
            },
            {
                id: '2',
                orderNumber: 'ORD-002',
                orderDate: new Date('2024-01-18'),
                status: 'Shipped',
                totalAmount: 89.50,
                paymentMethod: 'PayPal',
                trackingNumber: 'TRK987654321',
                estimatedDelivery: new Date('2024-01-25'),
                shippingAddress: {
                    fullName: 'Jane Smith',
                    street: '456 Oak Ave',
                    city: 'Los Angeles',
                    state: 'CA',
                    zipCode: '90210',
                    country: 'USA'
                },
                items: [
                    {
                        id: 3,
                        productName: 'Programming Book',
                        price: 45.99,
                        quantity: 1,
                        category: 'Books'
                    },
                    {
                        id: 4,
                        productName: 'Stickers Pack',
                        price: 14.99,
                        quantity: 3,
                        category: 'Accessories'
                    }
                ]
            },
            {
                id: '3',
                orderNumber: 'ORD-003',
                orderDate: new Date('2024-01-20'),
                status: 'Pending',
                totalAmount: 156.75,
                paymentMethod: 'Credit Card',
                shippingAddress: {
                    fullName: 'Bob Johnson',
                    street: '789 Pine Rd',
                    city: 'Chicago',
                    state: 'IL',
                    zipCode: '60601',
                    country: 'USA'
                },
                items: [
                    {
                        id: 5,
                        productName: 'Smart Watch',
                        price: 156.75,
                        quantity: 1,
                        category: 'Electronics'
                    }
                ]
            },
            {
                id: '4',
                orderNumber: 'ORD-004',
                orderDate: new Date('2024-01-22'),
                status: 'Confirmed',
                totalAmount: 67.89,
                paymentMethod: 'Credit Card',
                shippingAddress: {
                    fullName: 'Alice Brown',
                    street: '321 Elm St',
                    city: 'Miami',
                    state: 'FL',
                    zipCode: '33101',
                    country: 'USA'
                },
                items: [
                    {
                        id: 6,
                        productName: 'Coffee Mug',
                        price: 15.99,
                        quantity: 2,
                        category: 'Home'
                    },
                    {
                        id: 7,
                        productName: 'Desk Organizer',
                        price: 35.91,
                        quantity: 1,
                        category: 'Office'
                    }
                ]
            }
        ];
        this.filteredOrders = [...this.orders];
    }

    applyFilters() {
        this.filteredOrders = this.orders.filter(order => {
            const matchesStatus = this.statusFilter === 'All' || order.status === this.statusFilter;
            const matchesSearch = !this.searchText ||
                order.orderNumber.toLowerCase().includes(this.searchText.toLowerCase()) ||
                order.items.some(item =>
                    item.productName.toLowerCase().includes(this.searchText.toLowerCase())
                );

            let matchesDate = true;
            if (this.dateRange && this.dateRange[0] && this.dateRange[1]) {
                const orderDate = new Date(order.orderDate);
                matchesDate = orderDate >= this.dateRange[0] && orderDate <= this.dateRange[1];
            }

            return matchesStatus && matchesSearch && matchesDate;
        });
    }

    clearFilters() {
        this.statusFilter = 'All';
        this.dateRange = null;
        this.searchText = '';
        this.applyFilters();

        this.messageService.add({
            severity: 'info',
            summary: 'Filters Cleared',
            detail: 'All filters have been reset'
        });
    }

    clearSearch() {
        this.searchText = '';
        this.applyFilters();
    }

    clearDateRange() {
        this.dateRange = null;
        this.applyFilters();
    }

    getStatusSeverity(status: string): any {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Confirmed': return 'info';
            case 'Shipped': return 'primary';
            case 'Delivered': return 'success';
            case 'Cancelled': return 'danger';
            default: return 'info';
        }
    }

    viewOrderDetails(order: Order) {
        this.selectedOrder = order;
        this.displayOrderDialog = true;
    }

    cancelOrder(order: Order) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to cancel this order?',
            header: 'Confirm Cancellation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                order.status = 'Cancelled';
                this.applyFilters();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order cancelled successfully'
                });
            }
        });
    }

    getTotalItems(order: Order): number {
        return order.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getOrdersCountByStatus(status: string): number {
        return this.orders.filter(order => order.status === status).length;
    }

    getTotalRevenue(): number {
        return this.orders
            .filter(order => order.status === 'Delivered')
            .reduce((sum, order) => sum + order.totalAmount, 0);
    }

    // New method to get filtered orders count
    getFilteredOrdersCount(): number {
        return this.filteredOrders.length;
    }

    // New method to check if any filters are active
    hasActiveFilters(): boolean {
        return this.statusFilter !== 'All' ||
            this.searchText !== '' ||
            (this.dateRange !== null && this.dateRange.length === 2);
    }
}
