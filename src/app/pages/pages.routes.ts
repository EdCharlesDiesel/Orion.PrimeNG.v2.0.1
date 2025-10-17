import { Documentation } from '../core/admin/documentation/documentation';
import { Empty } from './empty/empty';
import { Routes } from '@angular/router';
import { AllProductsComponent } from './all-products/all-products.component';
import { TradingEconomicsDashboard } from './trading-economics-dashboard/trading-economics-dashboard';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { CheckOutPage } from './check-out-page/check-out-page';
import { ChatPage } from './chat-page/chat-page';
import { BlogPage } from './blog/blog-page';
import { FilesPage } from './files-page/files-upload-page';
import { TaskListPagePage } from './task-list-page/task-list-page';
import { MailPage } from './mail-page/mail-page';
import { Calendar } from 'primeng/calendar';
import { CalendarPage } from './calendar/calendar-page';


export default [
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
    { path: 'trading-economics-dashboard', component: TradingEconomicsDashboard },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
