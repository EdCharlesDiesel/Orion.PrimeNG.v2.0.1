import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
    selector: 'app-product-search',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AutoCompleteModule
    ],
    template:'./search.component.html',
    styleUrl:'./search.component.scss'
})
class ProductSearchComponent implements OnInit {
    searchControl = new FormControl('');
    products: any[] = [];
    filteredProducts: any[] = [];

    ngOnInit(): void {

    }

    filterProducts(event: any): void {
        const query = event.query.toLowerCase();

        if (!query) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.title.toLowerCase().includes(query)
            );
        }
    }

    searchStore(event: any): void {
        console.log('Selected:', event);

        const selectedValue = event.value || event;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.searchStore(this.searchControl.value);
        }
    }
}

export default ProductSearchComponent;
