
import { HttpClient,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  map,  } from 'rxjs/operators';
import { SubscriptionService } from './subscription.service';
import { Product } from '../core/models/product';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductSubscriptionService {

  baseURL = environment.baseURL + "productSubscription";

  constructor(private http: HttpClient,
              private subscriptionService: SubscriptionService) {

  }



  toggleBookSubscriptionItem(userId: number, productId: number) {
    return this.http.post<Product[]>(this.baseURL + `ToggleBookSubscription/${userId}/${productId}`, {})
      .pipe(map((response: Product[]) => {
        this.setBookSubscription(response);
        return response;
      }));
  }

  getBookSubscriptionItems(userId: number) {
    return this.http.get(this.baseURL + userId)
      .pipe(map((response: any) => {
        this.setBookSubscription(response);
        return response;
      }));
  }

  setBookSubscription(response: Product[]) {
    this.subscriptionService.wishlistItemcount$.next(response.length);
    this.subscriptionService.wishlistItem$.next(response);
  }

  clearBookSubscription(userId: number) {
    return this.http.delete<number>(this.baseURL + `${userId}`, {}).pipe(
      map((response: number) => {
        this.subscriptionService.wishlistItem$.next([]);
        return response;
      })
    );
  }

    toggleProductSubscriptionItem(userId: any, productId: any) {

    }

    clearProductSubscription(userId: any) {

    }
}
