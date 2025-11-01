import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
// import { DropdownModule } from 'primeng/dr';
// import { CalendarModule } from 'primeng/ca';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Calendar } from 'primeng/calendar';

interface EconomicEvent {
    country: string;
    category: string;
    event: string;
    date: string;
    actual: number | null;
    previous: number | null;
    forecast: number | null;
    importance: string;
}

@Component({
    selector: 'app-trading-economics-calendar',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        // DropdownModule,
        // CalendarModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        ProgressSpinnerModule,
        FormsModule,
        HttpClientModule,
        Calendar
    ],
    templateUrl: './trading-economics-calendar.component.html',
    styleUrls: ['./trading-economics-calendar.component.scss']
})
export class TradingEconomicsCalendarComponent implements OnInit {
    // Signals for reactive state management
    events = signal<EconomicEvent[]>([]);
    loading = signal(true);

    // Filter models
    selectedCountry?: string;
    selectedImportance?: string;
    dateRange: Date[] = [];
    searchTerm = '';

    // Dropdown data
    countries: string[] = ['United States', 'China', 'Germany', 'United Kingdom', 'Japan'];
    importanceLevels: string[] = ['Low', 'Medium', 'High'];

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.loadEvents();
    }

    loadEvents(): void {
        this.loading.set(true);
        // Replace with your actual API endpoint (e.g., /api/calendar)
        this.http.get<EconomicEvent[]>('https://localhost:5001/api/calendar').subscribe({
            next: (data) => {
                this.events.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading events', err);
                this.loading.set(false);
            }
        });
    }

    applyFilters(): EconomicEvent[] {
        let filtered = [...this.events()];

        if (this.selectedCountry) {
            filtered = filtered.filter((e) => e.country === this.selectedCountry);
        }

        if (this.selectedImportance) {
            filtered = filtered.filter((e) => e.importance.toLowerCase() === this.selectedImportance?.toLowerCase());
        }

        if (this.searchTerm.trim()) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter((e) => e.event.toLowerCase().includes(term) || e.category.toLowerCase().includes(term));
        }

        if (this.dateRange.length === 2) {
            const [start, end] = this.dateRange;
            filtered = filtered.filter((e) => {
                const d = new Date(e.date);
                return d >= start && d <= end;
            });
        }

        return filtered;
    }

    clearFilters(): void {
        this.selectedCountry = undefined;
        this.selectedImportance = undefined;
        this.dateRange = [];
        this.searchTerm = '';
    }
}
