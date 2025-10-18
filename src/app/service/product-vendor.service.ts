import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductVendor } from '../core/models/product-vendor.model';

@Injectable({
  providedIn: 'root'
})
export class ProductVendorService {
  private apiUrl = environment.purchasingBaseURL +'ProductVendor';

  constructor(private http: HttpClient) {}//localhost:9010/
  //TODO: Need to fix Not recommended hence I need to start using Guid to begin with.
  private tempId = 100;
  createProductVendor(data: ProductVendor): Observable<ProductVendor> {
    data.businessEntityID = ++this.tempId; // negative IDs as temp placeholders
    return this.http.post<ProductVendor>(this.apiUrl, data);
  }
  getProductVendors(): Observable<ProductVendor[]> {
    return this.http.get<ProductVendor[]>(this.apiUrl);
  }

  getProductVendorById(id: number): Observable<ProductVendor> {
    return this.http.get<ProductVendor>(`${this.apiUrl}/${id}`);
  }


  updateProductVendor(id: number, data: ProductVendor): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  public deleteProductVendor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
