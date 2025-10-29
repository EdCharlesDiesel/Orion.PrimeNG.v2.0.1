import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import { ProductCardComponent } from './product/product-card/product-card.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductSubscriptionComponent } from './product/product-subscription/product-subscription.component';
// import { CategoryListComponent } from './category-list/category-list-component';
import { ProductNewComponent } from './product/product-new/product-new.component';

@NgModule({
    declarations: [],
    imports: [
    CommonModule,
        ProductCardComponent,
        ProductDetailsComponent,
        ProductListComponent,
        ProductSubscriptionComponent,
        // CategoryListComponent,
        ProductNewComponent
    ]
})
export class FeaturesModule { }
