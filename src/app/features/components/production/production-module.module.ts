import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductSubscriptionComponent } from './product/product-subscription/product-subscription.component';


@NgModule({
    declarations: [],
    imports: [
    CommonModule,
        ProductDetailsComponent,
        ProductListComponent,
        ProductSubscriptionComponent,
    ]
})
export class FeaturesModule { }
