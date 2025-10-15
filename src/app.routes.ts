import { Routes } from '@angular/router';
import { Landing } from './app/pages/landing/landing';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/core/admin/dashboard/dashboard';
import { Documentation } from './app/core/admin/documentation/documentation';
import { DatabaseLog } from './app/core/admin/database-log/database-log';
import { Notfound } from './app/pages/notfound/notfound';
import { AdminLayout } from './app/layout/component/admin.layout';
import { ManageOrders } from './app/core/admin/manage-orders/manage-orders';
import { ProfileComponent } from './app/core/authentication/profile/profile.component';
import { BlogComponent } from './app/features/components/blog/blog.component';
import { ChatComponent } from './app/features/components/chat/chat.component';


export const appRoutes: Routes = [
    { path: '', component: Landing },
    { path: 'blog', component: BlogComponent },
    { path: 'chat', component: ChatComponent },
    { path: 'auth', loadChildren: () => import('./app/core/authentication/auth.routes') },
    { path: 'apps', loadChildren: () => import('./app/features/components/features-routing.module') },
    { path: 'notfound', component: Notfound },
    {
        path: 'admin',
        component: AdminLayout,
        // canActivate: [AdminGuard],
        children: [
            { path: 'manage-orders', component: ManageOrders },
            { path: 'dashboard', component: Dashboard },
            { path: 'profile', component: ProfileComponent },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'human-resources', loadChildren: () => import('./app/core/admin/human-resources/human-resources.routes') },
            { path: 'person', loadChildren: () => import('./app/core/admin/person/person.routes') },
            { path: 'sales', loadChildren: () => import('./app/core/admin/sales/sales.routes') },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },

            { path: 'database-log', component: DatabaseLog }
        ]
    },

    {
        path: 'store',
        component: AppLayout,
        // canActivate: [AdminGuard],
        children: [
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
        ]
    },
    {
        path: 'trading-economics',
        component: AppLayout,
        // canActivate: [AdminGuard],
        children: [
            { path: 'trading-economics', loadChildren: () => import('./app/trading-economics/trading-economics.routes') },
        ]
    },
    // {
    //     path: 'admin-super-user',
    //     component: AppLayout,
    //     canActivate: [AdminGuard],
    //     children: [
    //         { path: 'dashboard', component: Dashboard },
    //         { path: 'human-resources', loadChildren: () => import('./app/core/admin/human-resources/human-resources.routes') },
    //         { path: 'person', loadChildren: () => import('./app/core/admin/person/person.routes') },
    //         { path: 'sales', loadChildren: () => import('./app/core/admin/sales/sales.routes') },
    //         { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
    //         { path: 'documentation', component: Documentation },
    //         { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
    //     ]
    // },
    // {
    //     path: 'superUser',
    //     component: AppLayout,
    //     canActivate: [AuthGuard],
    //     children: [
    //         { path: 'dashboard', component: Dashboard },
    //         { path: 'human-resources', loadChildren: () => import('./app/core/admin/human-resources/human-resources.routes') },
    //         { path: 'person', loadChildren: () => import('./app/core/admin/person/person.routes') },
    //         { path: 'sales', loadChildren: () => import('./app/core/admin/sales/sales.routes') },
    //         { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
    //         { path: 'documentation', component: Documentation },
    //         { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
    //         { path: 'database-log', component: DatabaseLog }
    //     ]
    // },
    // {
    //     path: 'customer',
    //     component: AppLayout,
    //     canActivate: [AuthGuard],
    //     children: [
    //         { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
    //     ]
    // },
    // {
    //     path: 'internal-employee',
    //     component: AppLayout,
    //     canActivate: [RoleGuard],
    //     children: [
    //         { path: 'dashboard', component: Dashboard },
    //         { path: 'human-resources', loadChildren: () => import('./app/core/admin/human-resources/human-resources.routes') },
    //         { path: 'person', loadChildren: () => import('./app/core/admin/person/person.routes') },
    //         { path: 'sales', loadChildren: () => import('./app/core/admin/sales/sales.routes') },
    //         { path: 'documentation', component: Documentation },
    //     ]
    // },
    // {
    //     path: 'external-employee',
    //     component: AppLayout,
    //     canActivate: [RoleGuard],
    //     children: [
    //         { path: 'sales', loadChildren: () => import('./app/core/admin/sales/sales.routes') },
    //         { path: 'documentation', component: Documentation },
    //     ]
    // },
    // {
    //     path: 'user',
    //     component: AppLayout,
    //     canActivate: [NoAuthGuard],
    //     children: [
    //         { path: 'dashboard', component: Dashboard },
    //         { path: 'human-resources', loadChildren: () => import('./app/core/admin/human-resources/human-resources.routes') },
    //         { path: 'person', loadChildren: () => import('./app/core/admin/person/person.routes') },
    //         { path: 'sales', loadChildren: () => import('./app/core/admin/sales/sales.routes') },
    //         { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
    //         { path: 'documentation', component: Documentation },
    //         { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
    //         { path: 'database-log', component: DatabaseLog }
    //     ]
    // },
    { path: '**', redirectTo: '/notfound' }
];
