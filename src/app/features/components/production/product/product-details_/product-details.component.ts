import { EMPTY, Observable } from 'rxjs';
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import { catchError, tap } from 'rxjs/operators';
import { ProductService } from '../../../../../service/product.service';
import { SubscriptionService } from '../../../../../service/subscription.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  standalone: true,
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  id: any;
  productDetails$: Observable<any> = new Observable<any>();
  userData$: Observable<any> = new Observable<any>()

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService) {
    this.id = this.route.snapshot.paramMap.get('id');
    // this.userId = JSON.parse(localStorage.getItem('userId') || '{}');
    this.id = JSON.parse(this.route.snapshot.paramMap.get('id') || '{}')
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.id = params['id'];
        this.getProductDetails(this.id);
      }
    );
    this.userData$ = this.subscriptionService.userData;
      this.productDetails$ = this.subscriptionService.productDetails$;
  }

  public async getProductDetails(id: number) {
      // debugger
     await this.productService.getProductById(id)
      .pipe(tap((x)=>console.log('This is the value of product',x)),
       catchError(error => {
          console.log('Error ocurred while fetching product data : ', error);
          return EMPTY;
        })).subscribe( {
         next(x: any){
           console.log('This is the value of product',x)
         }
       });
  }
}
