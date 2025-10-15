import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CheckOutComponent } from '../../features/components/check-out/check-out.component';

@Component({
    selector: 'app-check-out-page',
    standalone: true,
    imports: [CheckOutComponent],
    template: `<app-checkout></app-checkout>`
})
export class CheckOutPage {}
