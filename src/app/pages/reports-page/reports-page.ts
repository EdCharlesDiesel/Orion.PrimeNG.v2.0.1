import { Component } from '@angular/core';
import { ReportsComponent } from '../../features/components/reports/reports.component';

@Component({
    selector: 'app-reports-page',
    standalone: true,
    imports: [ReportsComponent],
    template: ` <app-reports></app-reports> `
})
export class ReportsPage {}
