import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDeniedComponent } from '../../core/authentication/access-denied/access-denied.component';
import { ErrorComponent } from '../../core/authentication/error/error.component';
import { LoginComponent } from '../../core/authentication/login/login.component';
import { RegisterComponent } from '../../core/authentication/register/register.component';
import { ProfileComponent } from '../../core/authentication/profile/profile.component';


export default [
    {path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule)},
    {path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)},
    {path: 'reports', loadChildren: () => import('./reports/reports-routing.module').then(m => m.ReportsRoutingModule)},
    {path: 'files', loadChildren: () => import('./files/files.module').then(m => m.FilesModule)},
    {path: 'mail', loadChildren: () => import('./mail/mail-routing.module').then(m => m.MailRoutingModule)},
    {path: 'task-list', loadChildren: () => import('./task-list/task-list.module').then(m => m.TaskListModule)},

    {path: '**', redirectTo: '/notfound'}
] as Routes;
