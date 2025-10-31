import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProductCategory } from '../../models/product-category.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductCategoryService {
    private readonly http = inject(HttpClient);
    private API_URL = environment.productionBaseURL;
    productCategorySignal = signal<ProductCategory[]>([]);

    public getProductCategories(): Observable<ProductCategory[]> {
        return this.http.get<ProductCategory[]>(`${this.API_URL}/ProductCategory/`).pipe(
            catchError(error => {
                console.error(`Error fetching products for product category`, error);
                return of([]);
            })
        );
    }

    public createProductCategory(product: Partial<ProductCategory>): Observable<ProductCategory> {
        return this.http.post<ProductCategory>(this.API_URL, product);
    }

    public updateProduct(id: number, product: Partial<ProductCategory>): Observable<ProductCategory> {
        return this.http.put<ProductCategory>(`${this.API_URL}/${id}`, product);
    }

    deleteProductCategory(id: number): Observable<ProductCategory> {
        return this.http.delete<ProductCategory>(`${this.API_URL}/${id}`);
    }
}

