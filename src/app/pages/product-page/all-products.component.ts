import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../core/models/product';
import { Carousel } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { Tag } from 'primeng/tag';
import { ProductsComponent } from '../../features/components/products/products/products.component';
import { GdpPerCountryComponent } from '../../trading-economics/gdp-per-country/gdp-per-country.component';

@Component({
    selector: 'app-products',
    templateUrl: './all-products.component.html',
    imports: [ ProductsComponent],
    styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent {

}
