import { Component } from '@angular/core';
import { WishListComponent } from '../../features/components/wish-list/wish-list.component';

@Component({
    selector: 'app-wish-list-page',
    standalone: true,
    imports: [WishListComponent],
    template: ` <app-wish-list></app-wish-list> `
})
export class WishListPage {}
