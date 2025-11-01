import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Product } from '../core/models/product';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private API_URL = environment.productionBaseURL;


  products = signal<Product[]>([]);
  categories$: any;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}` + `Products`).pipe(
      tap(products => {
        this.products.set(products);
        console.log('Products loaded:', products.length);
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]);
      })
    );
  }

  public getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
      })
    );
  }

  public getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/category/${category}`).pipe(
      catchError(error => {
        console.error(`Error fetching products for category ${category}:`, error);
        return of([]);
      })
    );
  }


  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.API_URL).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, product);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.API_URL}/${id}`);
  }

    getProductsSmall(): Observable<Product> {
        return this.http.delete<Product>(`${this.API_URL}/`);
    }

    getProductsWithOrdersSmall(): Observable<Product>  {
        return this.http.delete<Product>(`${this.API_URL}/`);
    }
}

