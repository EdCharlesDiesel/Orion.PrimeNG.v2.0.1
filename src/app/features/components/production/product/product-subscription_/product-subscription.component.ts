import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SnackbarService } from '../../../../../service/snackbar.service';
import { Product } from '../../../../models/product';
import { SubscriptionService } from '../../../../../service/subscription.service';
import { ProductSubscriptionService } from '../../../../../service/product-subscription.service';

@Component({
  selector: 'app-product-subscription',
  templateUrl: './product-subscription.component.html',
  styleUrls: ['./product-subscription.component.scss']
})
export class ProductSubscriptionComponent implements OnInit {
  productSubscriptionItems$: Observable<Product[]>= new Observable<Product[]>();
  isLoading: boolean = false;
  userId: any;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private subscriptionService: SubscriptionService,
    private productSubscriptionService: ProductSubscriptionService,
    private snackBarService: SnackbarService) {
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getProductSubscriptionItems();
  }

  getProductSubscriptionItems() {
    this.productSubscriptionItems$ = this.subscriptionService.productSubscriptionItem$;
    this.isLoading = false;
  }

   clearProductSubscription() {
  //     this.productSubscriptionService.clearProductSubscription(this.userId)
  //       .pipe(takeUntil(this.unsubscribe$))
  //       .subscribe(
  //         result => {
  //           this.subscriptionService.productSubscriptionItemcount$.next(result);
  //           this.snackBarService.showSnackBar('Productsubscription cleared!!!');
  //           this.getShoppingCartItems();
  //         }, error => {
  //           console.log('Error ocurred while deleting productSubscription item : ', error);
  //         });
   }
}
