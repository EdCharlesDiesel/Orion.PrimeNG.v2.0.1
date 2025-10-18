import { Component} from '@angular/core';
import { GdpPerCountryComponent } from '../gdp-per-country/gdp-per-country.component';

@Component({
    selector: 'app-trading-economics-dashboard',
    templateUrl: './trading-economics-dashboard.html',
    imports: [ GdpPerCountryComponent],
    styleUrls: ['./trading-economics-dashboard.scss']
})
export class TradingEconomicsDashboard {

}
