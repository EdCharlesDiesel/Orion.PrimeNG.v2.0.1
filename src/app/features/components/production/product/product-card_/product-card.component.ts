// import {Component, Input, OnInit} from '@angular/core';
// import {ActivatedRoute, Router} from '@angular/router';
// import {Observable} from 'rxjs';
// import {map} from "rxjs/operators";
// import {User} from "../../../pages/user-login/user";
// import {Product} from "../../../api/product";
// import {SubscriptionService} from "../../../service/subscription.service";
// import {ProductService} from "../../../service/product.service";
//
// @Component({
//   selector: 'app-product-card',
//   templateUrl: './product-card.component.html',
//   styleUrls: ['./product-card.component.scss']
// })
// export class ProductCardComponent implements OnInit {
//
//   @Input()
//   book?: Product;
//   id?: any;
//   isActive = false;
//   userData$: Observable<User> = new Observable<any>();
//   ProductDetails$: any;
//
//
//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private subscriptionService: SubscriptionService,
//     private bookService: ProductService) {
//     this.id = this.route.snapshot.paramMap.get('id');
//   }
//
//   ngOnInit() {
// //    this.userData$ = this.subscriptionService.userData;
//     this.ProductDetails$ = this.bookService.books$.pipe(map(book => book.find(b => b.id === this.id)));
//     console.log('Products Details',this.ProductDetails$);
//   }
//
//   goToPage(id: number) {
//     this.router.navigate(['/books/details/', id]);
//   }
// }
