import { Documentation } from '../core/admin/documentation/documentation';
import { Routes } from '@angular/router';
import { Empty } from '../pages/empty/empty';
import { GdpPerCountryComponent } from './gdp-per-country/gdp-per-country.component';



export default [
    { path: 'gdp', component: GdpPerCountryComponent },
    { path: 'documentation', component: Documentation },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
