import { Routes } from '@angular/router';
import { Empty } from '../pages/empty/empty';
import { GdpPerCountryComponent } from './gdp-per-country/gdp-per-country.component';
import { TradingEconomicsDashboard } from './trading-economics-dashboard/trading-economics-dashboard';
import { TradingEconomicsCalendarComponent } from './trading-economics-calendar/trading-economics-calendar.component';
import { ForecastComponent } from './forecasts/forecast.component';
import { NewsComponent } from './news/news.component';



export default [
    { path: 'trading-economics-dashboard', component: TradingEconomicsDashboard },
    { path: 'forecast', component: ForecastComponent },
    { path: 'calendar', component: TradingEconomicsCalendarComponent},
    { path: 'news', component: NewsComponent },
    { path: 'gdp-per-country', component: GdpPerCountryComponent },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
