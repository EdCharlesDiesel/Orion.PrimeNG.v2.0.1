import { Component, Input} from '@angular/core';
import { OnChanges } from '@angular/core';
import { Product } from '../../../models/product';
import { ProductSubscriptionService } from '../../../../service/product-subscription.service';
import { SubscriptionService } from '../../../../service/subscription.service';
import { SnackbarService } from '../../../../service/snackbar.service';

@Component({
  selector: 'app-addtoProductSubscription',
  templateUrl: './addtoproductsubscription.component.html',
  styleUrls: ['./addtoproductsubscription.component.scss']
})
export class AddtoProductSubscriptionComponentComponent implements OnChanges {


  @Input() productId?: any;

  @Input() showButton?:boolean;

  userId;
  toggle: boolean = false;
  buttonText!: string;
  public wishlistItems: Product[] = [];

  constructor(
    private productSubscriptionService: ProductSubscriptionService,
    private subscriptionService: SubscriptionService,
    private snackBarService: SnackbarService) {
    this.userId = JSON.parse(localStorage.getItem('userId')||'{}') ;

  }

  ngOnChanges() {
    this.subscriptionService.productSubscriptionItem$
    .pipe().subscribe(
      (productData: Product[]) => {
        this.setButtonText();
      });
  }


  setButtonText() {
    if (this.toggle) {
      this.buttonText = 'Remove from Productsubscription';
    } else {
      this.buttonText = 'Add to Productsubscription';
    }
  }

  toggleValue() {
    this.toggle = !this.toggle;
    this.setButtonText();

    // this.productSubscriptionService.toggleProductSubscriptionItem(this.userId, this.productId).subscribe(
    //   () => {
    //     if (this.toggle) {
    //       this.snackBarService.showSnackBar('Item added to your Productsubscription');
    //     } else {
    //       this.snackBarService.showSnackBar('Item removed from your Productsubscription');
    //     }
    //   }, error => {
    //     console.log('Error ocurred while adding to wish-list : ', error);
    //   });
  }
}
