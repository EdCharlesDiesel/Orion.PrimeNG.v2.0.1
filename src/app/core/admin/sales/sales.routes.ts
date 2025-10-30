import { Routes } from '@angular/router';
import { CreditCardComponent } from './credit-card/credit-card.component';
import { CurrencyComponent } from './currency/currency.component';

export default [
    { path: 'currency', data: { breadcrumb: 'Button' }, component: CurrencyComponent },
    { path: 'credit-card', data: { breadcrumb: 'Button' }, component: CreditCardComponent },
    // { path: 'country-region-currency', data: { breadcrumb: 'Button' }, component: CountryRegionCurrencyComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
