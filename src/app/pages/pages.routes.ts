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
import { ButtonDemo } from './uikit/buttondemo';
import { ChartDemo } from './uikit/chartdemo';
import { FileDemo } from './uikit/filedemo';
import { FormLayoutDemo } from './uikit/formlayoutdemo';
import { InputDemo } from './uikit/inputdemo';
import { ListDemo } from './uikit/listdemo';
import { MediaDemo } from './uikit/mediademo';
import { MessagesDemo } from './uikit/messagesdemo';
import { MiscDemo } from './uikit/miscdemo';
import { PanelsDemo } from './uikit/panelsdemo';
import { TimelineDemo } from './uikit/timelinedemo';
import { OverlayDemo } from './uikit/overlaydemo';
import { TreeDemo } from './uikit/treedemo';
import { MenuDemo } from './uikit/menudemo';
import { AdminOrderingTrackingMapPage } from './admin-ordering-tracking-map-page/admin-ordering-tracking-mapp-page';

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
    { path: 'admin-order-tracking-map', component: AdminOrderingTrackingMapPage  },
    { path: 'empty', component: Empty },




    { path: 'button', data: { breadcrumb: 'Button' }, component: ButtonDemo },
    { path: 'charts', data: { breadcrumb: 'Charts' }, component: ChartDemo },
    { path: 'file', data: { breadcrumb: 'File' }, component: FileDemo },
    { path: 'formlayout', data: { breadcrumb: 'Form Layout' }, component: FormLayoutDemo },
    { path: 'input', data: { breadcrumb: 'Input' }, component: InputDemo },
    { path: 'list', data: { breadcrumb: 'List' }, component: ListDemo },
    { path: 'media', data: { breadcrumb: 'Media' }, component: MediaDemo },
    { path: 'message', data: { breadcrumb: 'Message' }, component: MessagesDemo },
    { path: 'misc', data: { breadcrumb: 'Misc' }, component: MiscDemo },
    { path: 'panel', data: { breadcrumb: 'Panel' }, component: PanelsDemo },
    { path: 'timeline', data: { breadcrumb: 'Timeline' }, component: TimelineDemo },
    // { path: 'table', data: { breadcrumb: 'Table' }, component: TableDemo },
    { path: 'overlay', data: { breadcrumb: 'Overlay' }, component: OverlayDemo },
    { path: 'tree', data: { breadcrumb: 'Tree' }, component: TreeDemo },
    { path: 'menu', data: { breadcrumb: 'Menu' }, component: MenuDemo },

    { path: '**', redirectTo: '/notfound' }
] as Routes;
