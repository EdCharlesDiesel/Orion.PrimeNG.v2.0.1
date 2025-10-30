
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../../core/models/task.model';
import { DropdownModule } from 'primeng/dropdown';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Calendar } from 'primeng/calendar';
import { Textarea } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-task-dialog',
    imports: [DropdownModule, Dialog, Button, Checkbox, Calendar, ReactiveFormsModule, Textarea, InputText],
    templateUrl: './task-dialog.component.html'
})
export class TaskDialogComponent implements OnInit {
    @Input() task!: Task | null;
    @Input() displayDialog = false;
    @Output() save = new EventEmitter<Task>();
    @Output() close = new EventEmitter<void>();


    taskForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.taskForm = this.fb.group({
            title: [this.task?.title || '', Validators.required],
            description: [this.task?.description || ''],
            priority: [this.task?.priority || 'Medium', Validators.required],
            dueDate: [this.task?.dueDate || ''],
            completed: [this.task?.completed || false]
        });
    }

    submit() {
        if (this.taskForm.invalid) return;
        this.save.emit({ ...this.task, ...this.taskForm.value });
    }

    cancel() {
        this.close.emit();
    }
}
