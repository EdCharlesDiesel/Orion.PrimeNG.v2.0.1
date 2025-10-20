import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JobCandidatesService } from './job-candidates.service';
import { JobCandidate } from '../../../models/job-candidate.model';
import { tap } from 'rxjs/operators';
import { Employee } from '../../../models/employee.model';


interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}
@Component({
    selector: 'app-job-candidates',
    templateUrl: './job-candidates.component.html',
    styleUrls: ['./job-candidates.component.scss'],
    imports: [Button, ConfirmDialog, Dialog, IconField, InputIcon, InputText, NgIf, ReactiveFormsModule, TableModule, Toolbar, FormsModule],
    providers: [MessageService,ConfirmationService,JobCandidatesService]
})
export class JobCandidatesComponent implements OnInit {
    jobCandidateDialog: boolean = false;

    jobCandidates = signal<JobCandidate[]>([]);

    jobCandidate!: JobCandidate;

    selectedJobCandidates!: JobCandidate[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private jobCandidateService: JobCandidatesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.jobCandidateService
            .getJobCandidate()
            .pipe(tap((p) => console.log(JSON.stringify(p))))
            .subscribe((data) => {
                this.jobCandidates.set(data);

                //
                // this.jobCandidateService.getJobCandidates().then((data) => {
                //     this.jobCandidates.set(data);
                // });

                // this.jobCandidateService.jobCandidatesResult$.subscribe(
                //     (data: any) => {
                //         this.jobCandidates.set(data);
            });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'JobCandidate ID', header: 'Code', customExportHeader: 'JobCandidate Code' },
            { field: 'Name', header: 'Name' },
            { field: 'GroupName', header: 'Group Name' },
            { field: 'ModifiedDate', header: 'Modified Date' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    public openNew() {
        this.jobCandidate = {
            jobCandidateID: 0,
            resume: '',
            businessEntityID: 0,
            employee: new Employee(),
            modifiedDate: new Date()
        };
        this.submitted = false;
        this.jobCandidateDialog = true;
    }

    public editJobCandidate(jobCandidate: JobCandidate) {
        this.jobCandidate = { ...jobCandidate };
        this.jobCandidateDialog = true;
    }

    public deleteSelectedJobCandidates() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected jobCandidates?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.jobCandidates.set(this.jobCandidates().filter((val) => !this.selectedJobCandidates?.includes(val)));
                this.selectedJobCandidates = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'JobCandidates Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.jobCandidateDialog = false;
        this.submitted = false;
    }

    public deleteJobCandidate(jobCandidate: JobCandidate) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + jobCandidate.resume + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.jobCandidates.set(this.jobCandidates().filter((val) => val.jobCandidateID !== jobCandidate.jobCandidateID));
                this.jobCandidate = {
                    jobCandidateID: 0,
                    resume: '',
                    businessEntityID: 0,
                    employee: new Employee(),
                    modifiedDate: new Date()
                };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'JobCandidate Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.jobCandidates().length; i++) {
            if (this.jobCandidates()[i].jobCandidateID === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    private createId(): number {
        let id = 17;
        return ++id;
    }

    public getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    public saveJobCandidate() {
        this.submitted = true;
        let _jobCandidates = this.jobCandidates();
        if (this.jobCandidate.resume?.trim()) {
            if (this.jobCandidate.jobCandidateID) {
                _jobCandidates[this.findIndexById(this.jobCandidate.jobCandidateID)] = this.jobCandidate;
                this.jobCandidates.set([..._jobCandidates]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'JobCandidate Updated',
                    life: 3000
                });
            } else {
                this.jobCandidate.jobCandidateID = this.createId();
                this.jobCandidateService.createJobCandidate(this.jobCandidate);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'JobCandidate Created',
                    life: 3000
                });
                this.jobCandidates.set([..._jobCandidates, this.jobCandidate]);
            }

            this.jobCandidateDialog = false;
            // this.jobCandidate = {
            //     JobCandidateID : 0,
            //     Name : "",
            //     GroupName :"",
            //     ModifiedDate: new Date(),
            //     EmployeeJobCandidateHistories: []
            //  };
        }
    }
}

