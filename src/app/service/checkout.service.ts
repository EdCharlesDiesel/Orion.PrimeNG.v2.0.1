import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Order = jasmine.Order;
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseURL = environment.baseURL + "CheckOut";


  constructor(private http: HttpClient) {

  }

  placeOrder(userId: number, checkedOutItems: Order) {
    return this.http.post<number>(this.baseURL + `${userId}`, checkedOutItems);
  }
}
