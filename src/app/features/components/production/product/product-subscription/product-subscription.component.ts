import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

interface ProductSubscriptionItem {
    id: number;
    title: string;
    retailPrice: number;
    coverFileName: string;
    // Add other properties as needed
}

@Component({
    selector: 'app-product-subscription',
    templateUrl: './product-subscription.component.html',
    styleUrls: ['./product-subscription.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        CardModule,
        TableModule,
        ProgressSpinner,
        ImageModule,
        TooltipModule,
        MessageModule,
        ConfirmDialogModule,
        // Add your custom components:
        // AddToCartComponent,
        // AddToProductSubscriptionComponent
    ],
    providers: [ConfirmationService]
})
export class ProductSubscriptionComponent implements OnInit {
    private confirmationService = inject(ConfirmationService);

    // Replace with your actual observables and services
    productSubscriptionItems$!: Observable<ProductSubscriptionItem[]>;
    isLoading = false;
    error$!: Observable<string | null>;

    ngOnInit() {
        this.loadProductSubscriptions();
    }

    loadProductSubscriptions() {
        // Implement your data loading logic here
        this.isLoading = true;
        // this.productSubscriptionItems$ = this.subscriptionService.getSubscriptions();
        // Handle loading state and errors appropriately
    }

    clearProductSubscription() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to clear all product subscriptions?',
            header: 'Clear Subscriptions',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Implement clear logic
                // this.subscriptionService.clearSubscriptions().subscribe();
            }
        });
    }

    removeFromSubscription(productId: number) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to remove this product from your subscriptions?',
            header: 'Remove Subscription',
            icon: 'pi pi-info-circle',
            accept: () => {
                // Implement remove logic
                // this.subscriptionService.removeFromSubscription(productId).subscribe();
            }
        });
    }
}
