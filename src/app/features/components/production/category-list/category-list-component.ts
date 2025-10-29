// import { Component, OnInit, inject, DestroyRef, signal, computed } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { Observable } from 'rxjs';
// import { CardModule } from 'primeng/card';
// import { ButtonModule } from 'primeng/button';
// import { DividerModule } from 'primeng/divider';
// import { TooltipModule } from 'primeng/tooltip';
// import { ProgressSpinner } from 'primeng/progressspinner';
// import { MessageService } from 'primeng/api';
// import { ProductCategory } from '../../../../core/models/product-category.model';
// import { ProductService } from '../../../../service/product.service';
// import { ProductCategoryService } from '../../../../service/product-category-service';
// import { map, tap } from 'rxjs/operators';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { Product } from '../../../../core/models/product';
//
//
//
// @Component({
//     selector: 'app-category-list',
//     templateUrl: './category-list.component.html',
//     styleUrls: ['./category-list.component.scss'],
//     standalone: true,
//     imports: [
//         CommonModule,
//         RouterModule,
//         CardModule,
//         ButtonModule,
//         DividerModule,
//         TooltipModule,
//         ProgressSpinner
//     ]
// })
// export class CategoryListComponent implements OnInit {
//     private messageService = inject(MessageService);
//     private productService = inject(ProductService);
//     private categoryService = inject(ProductCategoryService);
//     private route = inject(ActivatedRoute);
//     private destroyRef = inject(DestroyRef);
//
//     categories = signal<ProductCategory[]>([]);
//     totalProducts = signal<number>(0);
//     category = signal<string | null>(null);
//     loading = signal<boolean>(false);
//
//     filteredCategories = computed(() => {
//         const currentCategory = this.category();
//         const allCategories = this.categories();
//
//         if (!currentCategory) return allCategories;
//
//         return allCategories.filter(cat =>
//             cat.name.toLowerCase().includes(currentCategory.toLowerCase())
//         );
//     });
//
//     categoriesCount = computed(() => this.categories().length);
//     categories$!: Observable<ProductCategory[]>;
//
//     ngOnInit() {
//         this.loadCategories();
//         this.loadTotalProducts();
//         this.subscribeToRouteParams();
//     }
//
//     private loadCategories(): void {
//         this.loading.set(true);
//
//         this.categoryService.getCategories()
//             .pipe(
//                 takeUntilDestroyed(this.destroyRef),
//                 tap(() => this.loading.set(false))
//             )
//             .subscribe({
//                 next: (categories) => {
//                     this.categories.set(categories);
//                 },
//                 error: (error) => {
//                     this.loading.set(false);
//                     this.messageService.add({
//                         severity: 'error',
//                         summary: 'Error',
//                         detail: 'Failed to load categories',
//                         life: 3000
//                     });
//                 }
//             });
//         this.categories$ = this.categoryService.getCategories();
//     }
//
//     private loadTotalProducts(): void {
//         this.productService
//             .getProducts()
//             .pipe(
//                 takeUntilDestroyed(this.destroyRef),
//                 map((response: Product[]) => {
//                     return response.length;
//                 })
//             )
//             .subscribe({
//                 next: (count) => this.totalProducts.set(count),
//                 error: (error) => {
//                     this.totalProducts.set(0);
//                     console.error('Error loading products count:', error);
//                 }
//             });
//     }
//
//     private subscribeToRouteParams(): void {
//         this.route.queryParams
//             .pipe(takeUntilDestroyed(this.destroyRef))
//             .subscribe(params => {
//                 this.category.set(params['category'] || null);
//             });
//     }
//
//     getCategoryIcon(categoryName: string): string {
//         const iconMap: { [key: string]: string } = {
//             'Electronics': 'pi pi-mobile',
//             'Clothing': 'pi pi-shopping-bag',
//             'Books': 'pi pi-book',
//             'Home': 'pi pi-home',
//             'Sports': 'pi pi-trophy',
//             'Beauty': 'pi pi-palette',
//             'Toys': 'pi pi-star',
//             'Food': 'pi pi-apple'
//         };
//
//         return iconMap[categoryName] || 'pi pi-tag';
//     }
//
//     refreshCategories(): void {
//         this.loading.set(true);
//
//         this.categoryService.getCategories()
//             .pipe(takeUntilDestroyed(this.destroyRef))
//             .subscribe({
//                 next: (categories) => {
//                     this.categories.set(categories);
//                     this.loading.set(false);
//                     this.messageService.add({
//                         severity: 'info',
//                         summary: 'Refreshed',
//                         detail: 'Categories updated',
//                         life: 2000
//                     });
//                 },
//                 error: (error) => {
//                     this.loading.set(false);
//                     this.messageService.add({
//                         severity: 'error',
//                         summary: 'Error',
//                         detail: 'Failed to refresh categories',
//                         life: 3000
//                     });
//                 }
//             });
//     }
//
//     setCategory(newCategory: string | null): void {
//         this.category.set(newCategory);
//     }
//
//     clearCategory(): void {
//         this.category.set(null);
//     }
// }
