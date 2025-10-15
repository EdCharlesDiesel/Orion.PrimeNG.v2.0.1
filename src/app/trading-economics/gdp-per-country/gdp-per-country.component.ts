import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Tag } from 'primeng/tag';

interface EconomicIndicator {
    indicator: string;
    value: string;
    previous: string;
    date: string;
    change: number;
}

@Component({
    selector: 'app-gdp-per-country',
    templateUrl: './gdp-per-country.component.html',
    imports: [Card, DatePipe, TableModule, DropdownModule, FormsModule, Tag],
    styleUrls: ['./gdp-per-country.component.scss']
})
export class GdpPerCountryComponent implements OnInit {
    data: EconomicIndicator[] = [];
    loading: boolean = true;
    countries: any[] = [];
    selectedCountry: any = null;

    // Mock data simulating Trading Economics API
    private mockData: { [key: string]: EconomicIndicator[] } = {
        'United States': [
            { indicator: 'GDP Growth Rate', value: '2.8%', previous: '3.0%', date: '2024-Q3', change: -0.2 },
            { indicator: 'Unemployment Rate', value: '3.8%', previous: '3.9%', date: 'Sep 2024', change: -0.1 },
            { indicator: 'Inflation Rate', value: '3.2%', previous: '3.7%', date: 'Sep 2024', change: -0.5 },
            { indicator: 'Interest Rate', value: '5.50%', previous: '5.50%', date: 'Sep 2024', change: 0 },
            { indicator: 'Consumer Confidence', value: '102.6', previous: '105.6', date: 'Sep 2024', change: -3.0 },
            { indicator: 'Trade Balance', value: '-$64.3B', previous: '-$70.4B', date: 'Aug 2024', change: 6.1 },
            { indicator: 'Retail Sales', value: '0.7%', previous: '0.1%', date: 'Sep 2024', change: 0.6 }
        ],
        'United Kingdom': [
            { indicator: 'GDP Growth Rate', value: '0.2%', previous: '0.5%', date: '2024-Q3', change: -0.3 },
            { indicator: 'Unemployment Rate', value: '4.3%', previous: '4.2%', date: 'Aug 2024', change: 0.1 },
            { indicator: 'Inflation Rate', value: '2.2%', previous: '2.0%', date: 'Sep 2024', change: 0.2 },
            { indicator: 'Interest Rate', value: '5.25%', previous: '5.25%', date: 'Sep 2024', change: 0 },
            { indicator: 'Consumer Confidence', value: '-21', previous: '-25', date: 'Sep 2024', change: 4 }
        ],
        Germany: [
            { indicator: 'GDP Growth Rate', value: '-0.1%', previous: '0.0%', date: '2024-Q3', change: -0.1 },
            { indicator: 'Unemployment Rate', value: '5.8%', previous: '5.7%', date: 'Sep 2024', change: 0.1 },
            { indicator: 'Inflation Rate', value: '2.4%', previous: '2.6%', date: 'Sep 2024', change: -0.2 },
            { indicator: 'Interest Rate', value: '4.50%', previous: '4.50%', date: 'Sep 2024', change: 0 },
            { indicator: 'Consumer Confidence', value: '-21.2', previous: '-22.0', date: 'Sep 2024', change: 0.8 }
        ],
        Japan: [
            { indicator: 'GDP Growth Rate', value: '0.7%', previous: '0.8%', date: '2024-Q3', change: -0.1 },
            { indicator: 'Unemployment Rate', value: '2.5%', previous: '2.5%', date: 'Aug 2024', change: 0 },
            { indicator: 'Inflation Rate', value: '2.8%', previous: '3.0%', date: 'Sep 2024', change: -0.2 },
            { indicator: 'Interest Rate', value: '0.25%', previous: '0.10%', date: 'Sep 2024', change: 0.15 },
            { indicator: 'Consumer Confidence', value: '36.9', previous: '36.7', date: 'Sep 2024', change: 0.2 }
        ]
    };
    today= new Date().getUTCDate();

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.countries = Object.keys(this.mockData).map((country) => ({
            label: country,
            value: country
        }));
        this.selectedCountry = this.countries[0].value;
        this.loadData();
    }

    loadData() {
        this.loading = true;

        // Simulate API call delay
        setTimeout(() => {
            this.data = this.mockData[this.selectedCountry];
            this.loading = false;
        }, 500);

        // To use real Trading Economics API:
        // const apiKey = 'YOUR_API_KEY';
        // const url = `https://api.tradingeconomics.com/country/${this.selectedCountry}?c=${apiKey}`;
        // this.http.get<any[]>(url).subscribe(
        //   response => {
        //     this.data = this.transformApiData(response);
        //     this.loading = false;
        //   },
        //   error => {
        //     console.error('Error fetching data:', error);
        //     this.loading = false;
        //   }
        // );
    }

    onCountryChange(event: any) {
        this.selectedCountry = event.value;
        this.loadData();
    }

    getChangeClass(change: number): string {
        if (change > 0) return 'change-positive';
        if (change < 0) return 'change-negative';
        return 'change-neutral';
    }

    getChangeIcon(change: number): string {
        if (change > 0) return 'pi pi-arrow-up';
        if (change < 0) return 'pi pi-arrow-down';
        return 'pi pi-minus';
    }
}
