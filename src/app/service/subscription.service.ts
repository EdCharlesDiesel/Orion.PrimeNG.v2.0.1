import { Injectable } from '@angular/core';
import { BehaviorSubject,  Subject } from 'rxjs';
import { Product } from '../core/models/product';
import { Person } from '../core/models/person.model';



@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  userData = new BehaviorSubject<Product>(new Product());
  productDetails$ = new BehaviorSubject<Person>(new Person());
  searchItemValue$ = new BehaviorSubject<string>('');
  wishlistItemcount$ = new Subject<number>();
  wishlistItem$ = new BehaviorSubject<Product[]>([]);
  cartItemcount$ = new Subject<number>();
  productSubItemcount$ = new Subject<number>();
  productSubscriptionItem$ = new BehaviorSubject<Product[]>([]);
  productSubscriptionItemcount$ = new Subject<number>();

}
