import { Component, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { Listbox } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-product-list',
    standalone: true,

    templateUrl: './product-list.component.html',
    imports: [Card, Listbox, FormsModule, Message, NgIf],
    styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
    pageTitle = 'Product List';
    selectedProductId?: number;

    products = signal([
        { id: 1, title: 'Laptop' },
        { id: 2, title: 'Headphones' },
        { id: 3, title: 'Smartwatch' }
    ]);

    errorMessage = signal('');

    onSelected(productId: number) {
        this.selectedProductId = productId;
    }
}
