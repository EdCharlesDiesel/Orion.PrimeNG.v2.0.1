import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { shareReplay } from 'rxjs/operators';
import { Customer } from '../core/models/customer';

@Injectable()
export class CustomerService {

  baseURL = environment.baseURL + "Customer";
  customers$ = this.getCustomers().pipe(shareReplay(1));

  constructor(private httpClient: HttpClient) {
  }

  getCustomers() {
    return this.httpClient.get<Customer[]>(this.baseURL);
  }

  getCustomersSmall() {
    return this.httpClient.get<any>(this.baseURL )
      .toPromise()
      .then(res => res.data as Customer[])
      .then(data => data);
  }

  getCustomersMedium() {
    return this.httpClient.get<any>(this.baseURL + 'Customer')
      .toPromise()
      .then(res => res.data as Customer[])
      .then(data => data);
  }

  getCustomersLarge() {
    return this.httpClient.get<any>(this.baseURL + 'Customer')
      .toPromise()
      .then(res => res.data as Customer[])
      .then(data => data);
  }
}
