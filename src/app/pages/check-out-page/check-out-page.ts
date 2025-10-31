import { Component } from '@angular/core';
import { CheckOutComponent } from '../../features/components/check-out/check-out.component';

@Component({
    selector: 'app-check-out-page',
    standalone: true,
    imports: [CheckOutComponent],
    template: `<app-checkout></app-checkout>`
})
export class CheckOutPage {}
