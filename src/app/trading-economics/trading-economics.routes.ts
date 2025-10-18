import { Documentation } from '../core/admin/documentation/documentation';
import { Routes } from '@angular/router';
import { Empty } from '../pages/empty/empty';
import { GdpPerCountryComponent } from './gdp-per-country/gdp-per-country.component';
import { TradingEconomicsDashboard } from '../pages/trading-economics-dashboard/trading-economics-dashboard';



export default [
    { path: 'trading-economics-dashboard', component: TradingEconomicsDashboard },
    { path: 'gdp', component: GdpPerCountryComponent },
    { path: 'documentation', component: Documentation },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
