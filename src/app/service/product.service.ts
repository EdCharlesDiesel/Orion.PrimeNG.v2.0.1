import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Product } from '../core/models/product';



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private API_URL = 'api/products';

  // Signal to store products
  products = signal<Product[]>([]);
    categories$: any;

  /**
   * Fetch all products from the API
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL).pipe(
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

  /**
   * Fetch a single product by ID
   */
  public getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Fetch products by category
   */
  public getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/category/${category}`).pipe(
      catchError(error => {
        console.error(`Error fetching products for category ${category}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('https://fakestoreapi.com/products/categories').pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  /**
   * Add a new product (this will simulate adding on the API)
   */
  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  /**
   * Update a product
   */
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, product);
  }

  /**
   * Delete a product
   */
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

