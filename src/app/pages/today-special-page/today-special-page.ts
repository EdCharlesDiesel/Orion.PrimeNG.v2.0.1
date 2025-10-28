import { TodaysSpecialComponent } from '../../features/components/special-product/todays-special.component';
import { Component } from '@angular/core';

@Component({
    selector: 'app-todays-special-page',
    template: `
    <app-todays-special></app-todays-special>
  `,
    standalone: true,
    imports: [TodaysSpecialComponent]
})
export class TodaysSpecialPage {
    today = new Date();
}
