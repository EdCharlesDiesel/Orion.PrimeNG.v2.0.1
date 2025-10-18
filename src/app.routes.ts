import { Routes } from '@angular/router';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AdminLayout } from './app/layout/component/admin.layout';
import { AdminGuard } from './app/core/authentication/guards/admin.guard';
import { Dashboard } from './app/core/admin/dashboard/dashboard';
import { DatabaseLog } from './app/core/admin/database-log/database-log';
import { ManageOrders } from './app/core/admin/manage-orders/manage-orders';
import { ProfileComponent } from './app/core/authentication/profile/profile.component';
import { Documentation } from './app/core/admin/documentation/documentation';
import { AppLayout } from './app/layout/component/app.layout';
import { BlogPage } from './app/pages/blog-page/blog-page';
import { ChatPage } from './app/pages/chat-page/chat-page';
import { FilesPage } from './app/pages/files-page/files-upload-page';
import { TaskListPagePage } from './app/pages/task-list-page/task-list-page';
import { MailPage } from './app/pages/mail-page/mail-page';
import { CalendarPage } from './app/pages/calendar-page/calendar-page';
import { AllProductsComponent } from './app/pages/product-page/all-products.component';
import { ShoppingCartComponent } from './app/pages/shopping-cart/shopping-cart.component';
import { CheckOutPage } from './app/pages/check-out-page/check-out-page';
import { OrderConfirmationComponent } from './app/pages/order-confirmation-page/order-confirmation.component';
import { Empty } from './app/pages/empty/empty';

export const appRoutes: Routes = [
    { path: '', component: Landing },
    { path: 'auth', loadChildren: () => import('./app/core/authentication/auth.routes') },
    { path: 'notfound', component: Notfound },
    {
        path: 'admin',
        component: AdminLayout,
        // canActivate: [AdminGuard],
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'database-log', component: DatabaseLog },
            { path: 'manage-orders', component: ManageOrders },
            { path: 'profile', component: ProfileComponent },
            { path: 'documentation', component: Documentation },
            { path: 'human-resources', loadChildren: () => import('./app/core/admin/human-resources/human-resources.routes') },
            { path: 'person', loadChildren: () => import('./app/core/admin/person/person.routes') },
            { path: 'production', loadChildren: () => import('./app/core/admin/production/production.routes') },
            { path: 'purchasing', loadChildren: () => import('./app/core/admin/purchasing/purchasing.routes') },
            { path: 'sales', loadChildren: () => import('./app/core/admin/sales/sales.routes') },
        ]
    },
    {
        path: 'pages',
        component: AppLayout,
        //canActivate: [AdminGuard],
        children: [
            { path: 'blog', component: BlogPage },
            { path: 'chat', component: ChatPage },
            { path: 'files', component: FilesPage },
            { path: 'task-list', component: TaskListPagePage },
            { path: 'mail', component: MailPage },
            { path: 'calendar', component: CalendarPage },
            { path: 'products', component: AllProductsComponent },
            { path: 'shopping-cart', component: ShoppingCartComponent },
            { path: 'check-out', component: CheckOutPage },
            { path: 'order-confirmation', component: OrderConfirmationComponent },
            { path: 'documentation', component: Documentation },
            { path: 'empty', component: Empty },
            { path: '**', redirectTo: '/notfound' }
        ]
    },
    {
        //lazy load
        path: 'trading-economics',
        component: AppLayout,
        //canActivate: [AdminGuard],
        loadChildren: () => import('./app/trading-economics/trading-economics.routes'),
    },
    { path: '**', redirectTo: '/notfound' }
];
