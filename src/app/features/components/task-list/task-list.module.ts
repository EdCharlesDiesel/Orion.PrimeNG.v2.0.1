import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ScrollTopModule } from 'primeng/scrolltop';
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {PaginatorModule} from "primeng/paginator";
import {TaskService} from "../../../service/task.service";
import {TaskListComponent} from "./task-list.component";
import {TaskDialogComponent} from "./task-dialog.component";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
// import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ProgressBarModule,
        BadgeModule,
        AvatarModule,
        ScrollPanelModule,
        TagModule,
        ChipModule,
        ButtonModule,
        SkeletonModule,
        AvatarGroupModule,
        ScrollTopModule,
        CardModule,
        TableModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
        PaginatorModule,
        CalendarModule,
        CheckboxModule,
        ReactiveFormsModule,
        // InputTextareaModule,
        InputTextModule,
        TaskListComponent,
        TaskDialogComponent
    ],
    providers: [TaskService],
    exports: [TaskListComponent, TaskDialogComponent]
})
export class TaskListModule {}
