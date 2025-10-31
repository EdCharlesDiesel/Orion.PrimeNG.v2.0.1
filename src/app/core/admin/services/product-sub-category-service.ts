import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductCategory } from '../../models/product-category.model';
import { environment } from '../../../../environments/environment';
import { ProductSubcategory } from '../../models/product-subcategory.model';

@Injectable({
    providedIn: 'root'
})
export class ProductSubCategoryService {
    private readonly http = inject(HttpClient);
    private API_URL = environment.productionBaseURL;
    productSubCategoriesSignal = signal<ProductCategory[]>([]);

    public getProductSubCategories(): Observable<ProductSubcategory[]> {
        return this.http.get<ProductSubcategory[]>(`${this.API_URL}/ProductSubcategory/`).pipe(
            catchError(error => {
                console.error(`Error fetching products for product sub category`, error);
                return of([]);
            })
        );
    }

    public createProductSubCategory(product: Partial<ProductSubcategory>): Observable<ProductSubcategory> {
        return this.http.post<ProductSubcategory>(this.API_URL, product);
    }

    public updateProductSubCategory(id: number, product: Partial<ProductSubcategory>): Observable<ProductSubcategory> {
        return this.http.put<ProductSubcategory>(`${this.API_URL}/${id}`, product);
    }

    deleteProductSubCategory(id: number): Observable<ProductSubcategory> {
        return this.http.delete<ProductSubcategory>(`${this.API_URL}/${id}`);
    }
}

