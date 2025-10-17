import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TaskService } from '../../../service/task.service';
import { Task } from '../../../core/models/task.model';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    providers: [MessageService],
    imports: [Card, Button, TableModule, DatePipe, Checkbox, FormsModule]
})
export class TaskListComponent implements OnInit {

    id?: number;

    tasks: Task[] = [
         {
            id: 1,
            title: "Programming",
            description: "Programing Angular",
            priority:'High',
            dueDate: new Date(), // ISO string
            completed: true,
            category: "string"
        }
    ];
    selectedTask: Task | null = null;
    displayDialog = false;

    constructor(
        private taskService: TaskService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadTasks();
    }

    loadTasks() {
        this.taskService.getTasks().subscribe({
            next: (data: Task[]) => (this.tasks = data),
            error: (err: any) => {
                console.error(err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load tasks' });
            }
        });
    }

    openDialog(task?: Task) {
        this.selectedTask = task || null;
        this.displayDialog = true;
    }

    deleteTask(task: Task) {
        // if (!task.) return;
        //
        // this.taskService.deleteTask(task.id).subscribe({
        //   next: () => {
        //     this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Task deleted successfully' });
        //     this.loadTasks();
        //   },
        //   error: (err: any) => {
        //     console.error(err);
        //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete task' });
        //   },
        // });
    }
}
