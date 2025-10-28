import { Component, OnInit } from '@angular/core';
import { DatabaseLogService } from '../services/database-log.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DatabaseLogModel } from '../../models/database-log.model';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { Card } from 'primeng/card';
import { Textarea } from 'primeng/textarea';
import { NgForOf } from '@angular/common';

@Component({
    selector: 'app-database-log',
    templateUrl: './database-log.html',
    styleUrls: ['./database-log.scss'],
    standalone: true,
    imports: [Dialog, Button, TableModule, ReactiveFormsModule, InputText, Toast, Card, Textarea, NgForOf],
    providers: [MessageService]
})
export class DatabaseLog implements OnInit {
    systemInfoList: DatabaseLogModel[] = [];
    selectedSystemInfo!: DatabaseLogModel | null;
    displayDialog: boolean = false;
    systemInfoForm!: FormGroup;
    editing: boolean = false;
    loading: boolean = false;
    cols: any[] = [];

    constructor(
        private fb: FormBuilder,
        private service: DatabaseLogService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.cols = [
            { field: 'databaseLogID', header: 'ID' },
            { field: 'postTime', header: 'Post Time' },
            { field: 'databaseUser', header: 'Database User' },
            { field: 'event', header: 'Event' },
            { field: 'schema', header: 'Schema' },
            { field: 'object', header: 'Object' },
            { field: 'tsql', header: 'TSQL' },
            { field: 'xmlEvent', header: 'XML Event' }
        ];

        this.systemInfoForm = this.fb.group({
            postTime: [new Date().toISOString(), Validators.required],
            databaseUser: ['', Validators.required],
            event: ['', Validators.required],
            schema: [''],
            object: [''],
            tsql: [''],
            xmlEvent: ['']
        });

        this.loadData();
    }

    public loadData() {
        this.loading = true;
        this.service.getDatabaseLog().subscribe({
            next: (data) => {
                this.systemInfoList = data;
                this.loading = false;
            },
            error: () => (this.loading = false)
        });
    }

    public refresh() {
        this.loadData();
    }

    public openNew() {
        this.systemInfoForm.reset({
            postTime: new Date().toISOString()
        });
        this.displayDialog = true;
        this.editing = false;
        this.selectedSystemInfo = null;
    }

    public editSystemInfo(systemInfo: DatabaseLogModel) {
        this.systemInfoForm.patchValue(systemInfo);
        this.selectedSystemInfo = systemInfo;
        this.displayDialog = true;
        this.editing = true;
    }

    public saveSystemInfo() {
        if (this.systemInfoForm.invalid) return;

        const formValue = this.systemInfoForm.value;

        if (this.editing && this.selectedSystemInfo && this.selectedSystemInfo.databaseLogID) {
            this.service.updateDatabaseLog(this.selectedSystemInfo.databaseLogID, formValue).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Log updated successfully' });
                    this.loadData();
                    this.hideDialog();
                },
                error: (err) => {
                    console.error(err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update log' });
                }
            });
        } else {
            // Create new log
            this.service.createDatabaseLog(formValue).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Log added successfully' });
                    this.loadData();
                    this.hideDialog();
                },
                error: (err) => {
                    console.error(err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create log' });
                }
            });
        }
    }

    public deleteSystemInfo(systemInfo: DatabaseLogModel) {
        if (!systemInfo.databaseLogID) return;
        this.service.deleteDatabaseLog(systemInfo.databaseLogID).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Log deleted successfully' });
                this.loadData();
            },
            error: (err) => {
                console.error(err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete log' });
            }
        });
    }

    public hideDialog() {
        this.displayDialog = false;
        this.selectedSystemInfo = null;
    }

    public onRowSelect(event: any) {
        this.selectedSystemInfo = event.data;
        this.displayDialog = true;
    }
}
