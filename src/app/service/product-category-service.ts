import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../core/models/product';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProductCategory } from '../core/models/product-category.model';

@Injectable({
    providedIn: 'root'
})
export class ProductCategoryService {
    private readonly http = inject(HttpClient);
    private API_URL = 'api/products';


    products = signal<Product[]>([]);
    categories$: any;




    public getProductsByCategory(category: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.API_URL}/category/${category}`).pipe(
            catchError(error => {
                console.error(`Error fetching products for category ${category}:`, error);
                return of([]);
            })
        );
    }

    public getCategories(): Observable<ProductCategory[]> {
        return this.http.get<ProductCategory[]>(`${this.API_URL}`).pipe(
            catchError(error => {
                console.error('Error fetching categories:', error);
                return of([]);
            })
        );
    }

    addProduct(product: Partial<ProductCategory>): Observable<ProductCategory> {
        return this.http.post<ProductCategory>(this.API_URL, product);
    }

    updateProduct(id: number, product: Partial<ProductCategory>): Observable<ProductCategory> {
        return this.http.put<ProductCategory>(`${this.API_URL}/${id}`, product);
    }


    deleteProduct(id: number): Observable<ProductCategory> {
        return this.http.delete<ProductCategory>(`${this.API_URL}/${id}`);
    }

    getProductsSmall(): Observable<ProductCategory> {
        return this.http.delete<ProductCategory>(`${this.API_URL}/`);
    }

    getProductsWithOrdersSmall(): Observable<ProductCategory>  {
        return this.http.delete<ProductCategory>(`${this.API_URL}/`);
    }
}

