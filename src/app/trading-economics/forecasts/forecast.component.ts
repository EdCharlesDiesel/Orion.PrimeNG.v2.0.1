import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from 'primeng/card';
// import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { UIChart } from 'primeng/chart';
import { ProgressSpinner } from 'primeng/progressspinner';

interface ForecastData {
    indicator: string;
    period: string;
    forecast: string;
    q1?: string;
    q2?: string;
    q3?: string;
    q4?: string;
    confidence: number;
}

interface ChartDataset {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
}

@Component({
    selector: 'app-trading-economics-forecast',
    templateUrl: './forecast.component.html',
    imports: [Card, FormsModule, TableModule, Tag, DatePipe, UIChart, ProgressSpinner],
    styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit {
    // API Configuration
    private readonly API_KEY = 'guest'; // Replace with your Trading Economics API key
    private readonly BASE_URL = 'https://api.tradingeconomics.com';

    // Data properties
    forecastData: ForecastData[] = [];
    loading = false;
    today = new Date();

    // Dropdown options
    countries = [
        { label: 'United States', value: 'united states' },
        { label: 'United Kingdom', value: 'united kingdom' },
        { label: 'Germany', value: 'germany' },
        { label: 'France', value: 'france' },
        { label: 'Japan', value: 'japan' },
        { label: 'China', value: 'china' },
        { label: 'India', value: 'india' },
        { label: 'Brazil', value: 'brazil' },
        { label: 'Canada', value: 'canada' },
        { label: 'Australia', value: 'australia' }
    ];

    indicators = [
        { label: 'GDP Growth Rate', value: 'GDP' },
        { label: 'Inflation Rate', value: 'Inflation Rate' },
        { label: 'Interest Rate', value: 'Interest Rate' },
        { label: 'Unemployment Rate', value: 'Unemployment Rate' },
        { label: 'Government Debt to GDP', value: 'Government Debt to GDP' },
        { label: 'Current Account', value: 'Current Account' },
        { label: 'Consumer Spending', value: 'Consumer Spending' },
        { label: 'Manufacturing PMI', value: 'Manufacturing PMI' }
    ];

    selectedCountry = 'united states';
    selectedIndicator = 'GDP';

    // Summary metrics
    expectedGrowth = '2.5';
    forecastHorizon = '2025-2026';
    avgConfidence = '85';

    // Chart data
    chartData: any = {
        labels: [],
        datasets: []
    };

    chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            title: {
                display: true,
                text: 'Economic Forecast Trend'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Period'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        }
    };

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.loadForecastData();
    }

    onCountryChange(event: any): void {
        this.loadForecastData();
    }

    onIndicatorChange(event: any): void {
        this.loadForecastData();
    }

    loadForecastData(): void {
        this.loading = true;

        // Real API call (uncomment when you have an API key)
        /*
        const url = `${this.BASE_URL}/forecast/country/${this.selectedCountry}/indicator/${this.selectedIndicator}`;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.API_KEY}`
        });

        this.http.get<any[]>(url, { headers }).subscribe({
          next: (response) => {
            this.processForecastData(response);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching forecast data:', error);
            this.loadMockData();
            this.loading = false;
          }
        });
        */

        // Mock data (remove when using real API)
        setTimeout(() => {
            this.loadMockData();
            this.loading = false;
        }, 1000);
    }

    processForecastData(apiResponse: any[]): void {
        this.forecastData = apiResponse.map((item) => ({
            indicator: item.Category || this.selectedIndicator,
            period: item.Period || item.Quarter || item.Year,
            forecast: item.Value?.toFixed(2) || 'N/A',
            q1: item.Q1?.toFixed(2),
            q2: item.Q2?.toFixed(2),
            q3: item.Q3?.toFixed(2),
            q4: item.Q4?.toFixed(2),
            confidence: item.Confidence || Math.floor(Math.random() * 20) + 75
        }));

        this.updateChartData(apiResponse);
        this.calculateSummaryMetrics();
    }

    loadMockData(): void {
        const currentYear = new Date().getFullYear();

        this.forecastData = [
            {
                indicator: this.selectedIndicator,
                period: `Q1 ${currentYear}`,
                forecast: '2.3',
                q1: '2.3',
                q2: '2.5',
                q3: '2.7',
                q4: '2.8',
                confidence: 88
            },
            {
                indicator: this.selectedIndicator,
                period: `Q2 ${currentYear}`,
                forecast: '2.5',
                q1: '2.4',
                q2: '2.5',
                q3: '2.6',
                q4: '2.7',
                confidence: 85
            },
            {
                indicator: this.selectedIndicator,
                period: `Q3 ${currentYear}`,
                forecast: '2.7',
                q1: '2.5',
                q2: '2.7',
                q3: '2.8',
                q4: '2.9',
                confidence: 82
            },
            {
                indicator: this.selectedIndicator,
                period: `Q4 ${currentYear}`,
                forecast: '2.8',
                q1: '2.6',
                q2: '2.8',
                q3: '2.9',
                q4: '3.0',
                confidence: 80
            },
            {
                indicator: this.selectedIndicator,
                period: `Q1 ${currentYear + 1}`,
                forecast: '2.9',
                q1: '2.7',
                q2: '2.9',
                q3: '3.0',
                q4: '3.1',
                confidence: 75
            },
            {
                indicator: this.selectedIndicator,
                period: `Q2 ${currentYear + 1}`,
                forecast: '3.0',
                q1: '2.8',
                q2: '3.0',
                q3: '3.1',
                q4: '3.2',
                confidence: 73
            }
        ];

        this.updateMockChartData();
        this.calculateSummaryMetrics();
    }

    updateChartData(data: any[]): void {
        const labels = data.map((item) => item.Period || item.Quarter || item.Year);
        const forecastValues = data.map((item) => parseFloat(item.Value) || 0);

        this.chartData = {
            labels: labels,
            datasets: [
                {
                    label: `${this.selectedIndicator} Forecast`,
                    data: forecastValues,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    }

    updateMockChartData(): void {
        const labels = this.forecastData.map((item) => item.period);
        const forecastValues = this.forecastData.map((item) => parseFloat(item.forecast));
        const q1Values = this.forecastData.map((item) => parseFloat(item.q1 || '0'));
        const q4Values = this.forecastData.map((item) => parseFloat(item.q4 || '0'));

        this.chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Base Forecast',
                    data: forecastValues,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Optimistic (Q4)',
                    data: q4Values,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: false,
                    tension: 0.4,
                    borderDash: [5, 5]
                },
                {
                    label: 'Pessimistic (Q1)',
                    data: q1Values,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: false,
                    tension: 0.4,
                    borderDash: [5, 5]
                }
            ]
        };
    }

    calculateSummaryMetrics(): void {
        if (this.forecastData.length === 0) return;

        // Calculate expected growth
        const firstValue = parseFloat(this.forecastData[0].forecast);
        const lastValue = parseFloat(this.forecastData[this.forecastData.length - 1].forecast);
        this.expectedGrowth = (((lastValue - firstValue) / firstValue) * 100).toFixed(1);

        // Calculate forecast horizon
        const firstPeriod = this.forecastData[0].period;
        const lastPeriod = this.forecastData[this.forecastData.length - 1].period;
        this.forecastHorizon = `${firstPeriod} - ${lastPeriod}`;

        // Calculate average confidence
        const totalConfidence = this.forecastData.reduce((sum, item) => sum + item.confidence, 0);
        this.avgConfidence = (totalConfidence / this.forecastData.length).toFixed(0);
    }

    getConfidenceClass(confidence: number): string {
        if (confidence >= 85) return 'confidence-high';
        if (confidence >= 70) return 'confidence-medium';
        return 'confidence-low';
    }
}
