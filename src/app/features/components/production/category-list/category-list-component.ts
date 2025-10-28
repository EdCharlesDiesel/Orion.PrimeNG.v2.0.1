import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

interface Category {
    categoryName: string;
    productCount?: number;
    // Add other properties as needed
}

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        CardModule,
        ButtonModule,
        DividerModule,
        TooltipModule,
        ProgressSpinner
    ]
})
export class CategoryListComponent implements OnInit {
    private messageService = inject(MessageService);

    categories$!: Observable<Category[]>;
    totalProducts$!: Observable<number>;
    category: string | null = null;

    ngOnInit() {
        // Initialize your observables
        // this.categories$ = this.categoryService.getCategories();
        // this.totalProducts$ = this.productService.getTotalProducts();

        // Get current category from route
        // this.route.queryParams.subscribe(params => {
        //   this.category = params['category'] || null;
        // });
    }

    getCategoryIcon(categoryName: string): string {
        const iconMap: { [key: string]: string } = {
            'Electronics': 'pi pi-mobile',
            'Clothing': 'pi pi-shopping-bag',
            'Books': 'pi pi-book',
            'Home': 'pi pi-home',
            'Sports': 'pi pi-trophy',
            'Beauty': 'pi pi-palette',
            'Toys': 'pi pi-star',
            'Food': 'pi pi-apple'
        };

        return iconMap[categoryName] || 'pi pi-tag';
    }

    refreshCategories() {
        // Implement refresh logic
        this.messageService.add({
            severity: 'info',
            summary: 'Refreshed',
            detail: 'Categories updated',
            life: 2000
        });
    }
}
