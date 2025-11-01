import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from 'primeng/card';
// import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
// import { Calendar } from 'primeng/calendar';
import { InputText } from 'primeng/inputtext';
import { DatePipe, SlicePipe } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Paginator } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { Calendar } from 'primeng/calendar';

interface NewsArticle {
    id: string;
    title: string;
    description: string;
    date: Date;
    country: string;
    category: string;
    importance: string;
    url: string;
}

@Component({
    selector: 'app-trading-economics-news',
    templateUrl: './news.component.html',
    imports: [Card, FormsModule, InputText, DatePipe, ButtonDirective, ProgressSpinner, Paginator, TableModule, SlicePipe, Tooltip, DropdownModule, Calendar],
    styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
    // API Configuration
    private readonly API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your Trading Economics API key
    private readonly BASE_URL = 'https://api.tradingeconomics.com';

    // Data properties
    newsData: NewsArticle[] = [];
    filteredNews: NewsArticle[] = [];
    paginatedNews: NewsArticle[] = [];
    loading = false;
    today = new Date();

    // Filter properties
    selectedCountry: string = '';
    selectedCategory: string = '';
    dateRange: Date[] = [];
    searchTerm: string = '';

    // Pagination
    pageSize = 6;
    currentPage = 0;

    // Statistics
    totalNews = 0;
    todayNews = 0;
    countriesCount = 0;
    categoriesCount = 0;

    // Dropdown options
    countries = [
        { label: 'All Countries', value: '' },
        { label: 'United States', value: 'united states' },
        { label: 'United Kingdom', value: 'united kingdom' },
        { label: 'Germany', value: 'germany' },
        { label: 'France', value: 'france' },
        { label: 'Japan', value: 'japan' },
        { label: 'China', value: 'china' },
        { label: 'India', value: 'india' },
        { label: 'Brazil', value: 'brazil' },
        { label: 'Canada', value: 'canada' },
        { label: 'Australia', value: 'australia' },
        { label: 'Mexico', value: 'mexico' },
        { label: 'South Korea', value: 'south korea' },
        { label: 'Italy', value: 'italy' },
        { label: 'Spain', value: 'spain' }
    ];

    categories = [
        { label: 'All Categories', value: '' },
        { label: 'Markets', value: 'markets' },
        { label: 'GDP', value: 'gdp' },
        { label: 'Inflation', value: 'inflation' },
        { label: 'Trade', value: 'trade' },
        { label: 'Employment', value: 'employment' },
        { label: 'Government', value: 'government' },
        { label: 'Central Banks', value: 'central banks' },
        { label: 'Business', value: 'business' },
        { label: 'Consumer', value: 'consumer' },
        { label: 'Energy', value: 'energy' }
    ];

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.loadNewsData();
    }

    loadNewsData(): void {
        this.loading = true;

        // Real API call (uncomment when you have an API key)
        /*
        let params = new HttpParams().set('c', this.API_KEY);

        if (this.selectedCountry) {
          params = params.set('c', this.selectedCountry);
        }

        if (this.selectedCategory) {
          params = params.set('i', this.selectedCategory);
        }

        if (this.dateRange && this.dateRange.length === 2) {
          const startDate = this.formatDate(this.dateRange[0]);
          const endDate = this.formatDate(this.dateRange[1]);
          params = params.set('d1', startDate).set('d2', endDate);
        }

        const url = `${this.BASE_URL}/news`;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.API_KEY}`
        });

        this.http.get<any[]>(url, { params, headers }).subscribe({
          next: (response) => {
            this.processNewsData(response);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching news data:', error);
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

    processNewsData(apiResponse: any[]): void {
        this.newsData = apiResponse.map((item) => ({
            id: item.id || this.generateId(),
            title: item.title || item.Title,
            description: item.description || item.Description || '',
            date: new Date(item.date || item.Date),
            country: item.country || item.Country || 'Global',
            category: item.category || item.Category || 'General',
            importance: this.determineImportance(item),
            url: item.url || item.URL || '#'
        }));

        this.applyFilters();
        this.calculateStatistics();
    }

    loadMockData(): void {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

        this.newsData = [
            {
                id: '1',
                title: 'Federal Reserve Signals Potential Rate Cuts in 2025',
                description: 'The Federal Reserve indicated it may begin cutting interest rates in the second quarter of 2025 as inflation shows signs of moderating. Chair Powell emphasized a data-dependent approach.',
                date: now,
                country: 'United States',
                category: 'Central Banks',
                importance: 'High',
                url: 'https://tradingeconomics.com/news/fed-signals-rate-cuts'
            },
            {
                id: '2',
                title: 'China GDP Growth Exceeds Expectations at 5.2%',
                description: "China's economy grew by 5.2% in Q4 2024, surpassing analyst forecasts of 4.8%. The growth was driven by strong manufacturing and export performance.",
                date: now,
                country: 'China',
                category: 'GDP',
                importance: 'High',
                url: 'https://tradingeconomics.com/news/china-gdp-growth'
            },
            {
                id: '3',
                title: 'European Central Bank Maintains Interest Rates',
                description: 'The ECB held rates steady at 4.5% amid concerns about sluggish economic growth in the eurozone. President Lagarde emphasized vigilance on inflation.',
                date: yesterday,
                country: 'Germany',
                category: 'Central Banks',
                importance: 'High',
                url: 'https://tradingeconomics.com/news/ecb-rates'
            },
            {
                id: '4',
                title: 'UK Unemployment Rate Falls to 3.8%',
                description: 'The UK unemployment rate decreased to 3.8% in December, down from 4.0% in November. Job vacancies remained elevated across multiple sectors.',
                date: yesterday,
                country: 'United Kingdom',
                category: 'Employment',
                importance: 'Medium',
                url: 'https://tradingeconomics.com/news/uk-unemployment'
            },
            {
                id: '5',
                title: 'Oil Prices Surge on Middle East Tensions',
                description: 'Crude oil prices jumped 4% to $85 per barrel as geopolitical tensions in the Middle East raised concerns about supply disruptions.',
                date: yesterday,
                country: 'Global',
                category: 'Energy',
                importance: 'High',
                url: 'https://tradingeconomics.com/news/oil-prices'
            },
            {
                id: '6',
                title: 'Japan Inflation Rate Hits 2.4%',
                description: "Japan's inflation rate reached 2.4% in December, remaining above the Bank of Japan's 2% target for the 20th consecutive month.",
                date: twoDaysAgo,
                country: 'Japan',
                category: 'Inflation',
                importance: 'Medium',
                url: 'https://tradingeconomics.com/news/japan-inflation'
            },
            {
                id: '7',
                title: 'US Consumer Confidence Index Rises',
                description: 'The Consumer Confidence Index increased to 110.7 in January, up from 108.3 in December, signaling optimism about the economy.',
                date: twoDaysAgo,
                country: 'United States',
                category: 'Consumer',
                importance: 'Medium',
                url: 'https://tradingeconomics.com/news/us-consumer-confidence'
            },
            {
                id: '8',
                title: 'Germany Industrial Production Declines',
                description: "German industrial production fell 1.2% in December, missing expectations and raising concerns about the country's manufacturing sector.",
                date: twoDaysAgo,
                country: 'Germany',
                category: 'Business',
                importance: 'Medium',
                url: 'https://tradingeconomics.com/news/germany-industrial'
            },
            {
                id: '9',
                title: 'Brazil Trade Surplus Reaches Record High',
                description: 'Brazil recorded a trade surplus of $98.8 billion in 2024, the highest in history, driven by strong agricultural exports.',
                date: threeDaysAgo,
                country: 'Brazil',
                category: 'Trade',
                importance: 'Low',
                url: 'https://tradingeconomics.com/news/brazil-trade'
            },
            {
                id: '10',
                title: 'Indian Retail Sales Growth Accelerates',
                description: "India's retail sales grew 8.5% year-over-year in December, the fastest pace in six months, supported by festive season demand.",
                date: threeDaysAgo,
                country: 'India',
                category: 'Consumer',
                importance: 'Low',
                url: 'https://tradingeconomics.com/news/india-retail'
            },
            {
                id: '11',
                title: 'Canada Housing Starts Fall Below Expectations',
                description: 'Canadian housing starts declined to 220,000 units in December, below the forecasted 240,000, amid higher mortgage rates.',
                date: threeDaysAgo,
                country: 'Canada',
                category: 'Business',
                importance: 'Low',
                url: 'https://tradingeconomics.com/news/canada-housing'
            },
            {
                id: '12',
                title: 'Australia Exports to China Rebound Strongly',
                description: 'Australian exports to China increased 15% in Q4 2024, driven by iron ore and liquefied natural gas shipments.',
                date: threeDaysAgo,
                country: 'Australia',
                category: 'Trade',
                importance: 'Medium',
                url: 'https://tradingeconomics.com/news/australia-exports'
            }
        ];

        this.applyFilters();
        this.calculateStatistics();
    }

    applyFilters(): void {
        this.filteredNews = this.newsData.filter((news) => {
            let matches = true;

            // Country filter
            if (this.selectedCountry && news.country.toLowerCase() !== this.selectedCountry.toLowerCase()) {
                matches = false;
            }

            // Category filter
            if (this.selectedCategory && news.category.toLowerCase() !== this.selectedCategory.toLowerCase()) {
                matches = false;
            }

            // Date range filter
            if (this.dateRange && this.dateRange.length === 2) {
                const newsDate = new Date(news.date);
                const startDate = new Date(this.dateRange[0]);
                const endDate = new Date(this.dateRange[1]);
                endDate.setHours(23, 59, 59, 999);

                if (newsDate < startDate || newsDate > endDate) {
                    matches = false;
                }
            }

            // Search term filter
            if (this.searchTerm) {
                const searchLower = this.searchTerm.toLowerCase();
                const titleMatch = news.title.toLowerCase().includes(searchLower);
                const descMatch = news.description.toLowerCase().includes(searchLower);
                const countryMatch = news.country.toLowerCase().includes(searchLower);

                if (!titleMatch && !descMatch && !countryMatch) {
                    matches = false;
                }
            }

            return matches;
        });

        this.updatePagination();
    }

    updatePagination(): void {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedNews = this.filteredNews.slice(startIndex, endIndex);
    }

    calculateStatistics(): void {
        this.totalNews = this.newsData.length;

        // Count today's news
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        this.todayNews = this.newsData.filter((news) => new Date(news.date) >= todayStart).length;

        // Count unique countries
        const uniqueCountries = new Set(this.newsData.map((news) => news.country));
        this.countriesCount = uniqueCountries.size;

        // Count unique categories
        const uniqueCategories = new Set(this.newsData.map((news) => news.category));
        this.categoriesCount = uniqueCategories.size;
    }

    onCountryChange(event: any): void {
        this.currentPage = 0;
        this.loadNewsData();
    }

    onCategoryChange(event: any): void {
        this.currentPage = 0;
        this.applyFilters();
    }

    onDateRangeChange(event: any): void {
        this.currentPage = 0;
        this.applyFilters();
    }

    onSearch(): void {
        this.currentPage = 0;
        this.applyFilters();
    }

    onPageChange(event: any): void {
        this.currentPage = event.page;
        this.pageSize = event.rows;
        this.updatePagination();
    }

    openNewsLink(url: string): void {
        window.open(url, '_blank');
    }

    getCategoryClass(category: string): string {
        const categoryMap: { [key: string]: string } = {
            'central banks': 'category-central-banks',
            gdp: 'category-gdp',
            inflation: 'category-inflation',
            trade: 'category-trade',
            employment: 'category-employment',
            government: 'category-government',
            business: 'category-business',
            consumer: 'category-consumer',
            energy: 'category-energy',
            markets: 'category-markets'
        };

        return categoryMap[category.toLowerCase()] || 'category-default';
    }

    getCategorySeverity(category: string): string {
        const severityMap: { [key: string]: string } = {
            'central banks': 'danger',
            gdp: 'success',
            inflation: 'warning',
            trade: 'info',
            employment: 'success',
            government: 'secondary',
            business: 'info',
            consumer: 'primary',
            energy: 'warning',
            markets: 'danger'
        };

        return severityMap[category.toLowerCase()] || 'secondary';
    }

    getImportanceClass(importance: string): string {
        return `importance-${importance.toLowerCase()}`;
    }

    private determineImportance(item: any): string {
        // Logic to determine importance based on API data
        if (item.importance) return item.importance;
        if (item.Importance) return item.Importance;
        return 'Medium';
    }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 15);
    }
}
