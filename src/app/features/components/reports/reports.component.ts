import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { TabsModule } from 'primeng/tabs';
import { Tooltip } from 'primeng/tooltip';

interface Report {
    id: number;
    name: string;
    type: string;
    generatedDate: Date;
    status: 'completed' | 'pending' | 'failed';
    size: string;
    generatedBy: string;
}

interface ChartData {
    labels: string[];
    datasets: any[];
}

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, FormsModule, Card, Button, TableModule, Tag, Select, DatePicker, IconField, InputIcon, InputText, ChartModule, TabsModule, Tooltip, Tooltip, Tooltip],
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
    reports = signal<Report[]>([]);
    selectedReports = signal<Report[]>([]);
    searchValue = signal('');
    selectedType = signal<string | null>(null);
    selectedDateRange = signal<Date[] | null>(null);

    reportTypes = [
        { label: 'All Reports', value: null },
        { label: 'Sales Report', value: 'sales' },
        { label: 'Inventory Report', value: 'inventory' },
        { label: 'Financial Report', value: 'financial' },
        { label: 'Customer Report', value: 'customer' }
    ];

    // Chart Data
    salesChartData = signal<ChartData>({
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 55],
                fill: false,
                borderColor: '#42A5F5',
                tension: 0.4
            },
            {
                label: 'Revenue',
                data: [28, 48, 40, 19, 86, 27],
                fill: false,
                borderColor: '#FFA726',
                tension: 0.4
            }
        ]
    });

    pieChartData = signal<ChartData>({
        labels: ['Sales', 'Inventory', 'Financial', 'Customer'],
        datasets: [
            {
                data: [300, 50, 100, 80],
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
                hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#BA68C8']
            }
        ]
    });

    chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };

    pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    };

    filteredReports = computed(() => {
        let filtered = this.reports();

        // Filter by search
        if (this.searchValue()) {
            filtered = filtered.filter((report) => report.name.toLowerCase().includes(this.searchValue().toLowerCase()) || report.generatedBy.toLowerCase().includes(this.searchValue().toLowerCase()));
        }

        // Filter by type
        if (this.selectedType()) {
            filtered = filtered.filter((report) => report.type === this.selectedType());
        }

        // Filter by date range
        if (this.selectedDateRange() && this.selectedDateRange()!.length === 2) {
            const [start, end] = this.selectedDateRange()!;
            filtered = filtered.filter((report) => {
                const reportDate = new Date(report.generatedDate);
                return reportDate >= start && reportDate <= end;
            });
        }

        return filtered;
    });

    ngOnInit(): void {
        this.loadReports();
    }

    loadReports(): void {
        // Simulated data
        const mockReports: Report[] = [
            {
                id: 1,
                name: 'Q4 Sales Report',
                type: 'sales',
                generatedDate: new Date('2024-10-15'),
                status: 'completed',
                size: '2.4 MB',
                generatedBy: 'John Doe'
            },
            {
                id: 2,
                name: 'October Inventory',
                type: 'inventory',
                generatedDate: new Date('2024-10-20'),
                status: 'completed',
                size: '1.8 MB',
                generatedBy: 'Jane Smith'
            },
            {
                id: 3,
                name: 'Annual Financial Summary',
                type: 'financial',
                generatedDate: new Date('2024-10-25'),
                status: 'pending',
                size: '3.2 MB',
                generatedBy: 'Mike Johnson'
            },
            {
                id: 4,
                name: 'Customer Analytics',
                type: 'customer',
                generatedDate: new Date('2024-10-28'),
                status: 'completed',
                size: '4.1 MB',
                generatedBy: 'Sarah Williams'
            },
            {
                id: 5,
                name: 'Weekly Sales Summary',
                type: 'sales',
                generatedDate: new Date('2024-10-27'),
                status: 'failed',
                size: '0.9 MB',
                generatedBy: 'John Doe'
            }
        ];

        this.reports.set(mockReports);
    }

    getSeverity(status: string): 'success' | 'warn' | 'danger' {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warn';
            case 'failed':
                return 'danger';
            default:
                return 'warn';
        }
    }

    downloadReport(report: Report): void {
        console.log('Downloading report:', report.name);
        // Implement download logic
    }

    viewReport(report: Report): void {
        console.log('Viewing report:', report.name);
        // Implement view logic
    }

    deleteReport(report: Report): void {
        console.log('Deleting report:', report.name);
        this.reports.update((reports) => reports.filter((r) => r.id !== report.id));
    }

    generateNewReport(): void {
        console.log('Generating new report');
        // Implement generate report logic
    }

    exportSelected(): void {
        console.log('Exporting selected reports:', this.selectedReports());
        // Implement export logic
    }

    clearFilters(): void {
        this.searchValue.set('');
        this.selectedType.set(null);
        this.selectedDateRange.set(null);
    }

    getReportCountByType(type: string): number {
        return this.reports().filter((r) => r.type === type).length;
    }

    getCompletedReportsCount(): number {
        return this.reports().filter((r) => r.status === 'completed').length;
    }
}
