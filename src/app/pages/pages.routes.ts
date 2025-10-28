import { OrderConfirmationComponent } from './order-confirmation-page/order-confirmation.component';
import { BlogPage } from './blog-page/blog-page';
import { ChatPage } from './chat-page/chat-page';
import { FilesPage } from './files-page/files-upload-page';
import { TaskListPagePage } from './task-list-page/task-list-page';
import { MailPage } from './mail-page/mail-page';
import { CalendarPage } from './calendar-page/calendar-page';
import { Empty } from './empty/empty';
import { Routes } from '@angular/router';
import { ProductsPageComponent } from './product-page/products-page.component';
import { ShoppingCartPageComponent } from './shopping-cart-page/shopping-cart-page.component';
import { CheckOutPage } from './check-out-page/check-out-page';
import { ReportsPage } from './reports-page/reports-page';
import { WishListPage } from './wish-list-page/wish-list-page';
import { NotificationPage } from './notifications-page/notification-page';
import { OrdersPage } from './orders-page/orders-page';
import { TodaysSpecialPage } from './today-special-page/today-special-page';

export default [
    { path: 'blog', component: BlogPage },
    { path: 'chat', component: ChatPage },
    { path: 'files', component: FilesPage },
    { path: 'task-list', component: TaskListPagePage },
    { path: 'mail', component: MailPage },
    { path: 'calendar', component: CalendarPage },
    { path: 'products', component: ProductsPageComponent },
    { path: 'orders', component: OrdersPage },
    { path: 'reports', component: ReportsPage },
    { path: 'notifications', component: NotificationPage },
    { path: 'wish-list', component: WishListPage },
    { path: 'today-special', component: TodaysSpecialPage },
    { path: 'shopping-cart', component: ShoppingCartPageComponent },
    { path: 'check-out', component: CheckOutPage },
    { path: 'order-confirmation', component: OrderConfirmationComponent },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
