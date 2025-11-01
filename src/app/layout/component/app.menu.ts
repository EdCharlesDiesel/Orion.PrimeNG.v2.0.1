import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { selectCartItemCount } from '../../store/cart/cart.selectors';
import { Store } from '@ngrx/store';
import { CartService } from '../../service/cart.service';
import { Observable } from 'rxjs';
import { PanelMenu } from 'primeng/panelmenu';
import { Divider } from 'primeng/divider';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, PanelMenu, Divider],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
            <p-divider></p-divider>
            <p-panelmenu [model]="panelMenuItems"></p-panelmenu>
        </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    panelMenuItems = [
        {
            label: 'Admin',
            icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    label: 'Human Resources',
                    icon: 'pi pi-fw pi-user-plus',
                    items: [
                        {
                            label: 'Departments',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/human-resources/departments']
                        },
                        {
                            label: 'Employee Department History',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/human-resources/employee-department-history']
                        },
                        {
                            label: 'Employee Pay History',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/human-resources/employee-pay-history']
                        },
                        {
                            label: 'Internal Employees',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/human-resources/internal-employees']
                        },
                        {
                            label: 'External Employees',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/human-resources/external-employees']
                        },
                        {
                            label: 'Job-Candidates',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/human-resources/job-candidate']
                        },
                        {
                            label: 'Shifts',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/human-resources/shifts']
                        }
                    ]
                },
                {
                    label: 'Person',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Addresses',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/person/addresses']
                        },
                        {
                            label: 'Address Type',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/person/address-type']
                        },
                        {
                            label: 'Business-Entity-Address',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/person/business-entity-address']
                        },
                        {
                            label: 'Business-Entity-Contact',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/person/business-entity-contact']
                        },
                        {
                            label: 'Contact-Type',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/person/contact-type']
                        },
                        {
                            label: 'Country-Region',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/person/country-region']
                        },
                        {
                            label: 'Email Address',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/person/email-address']
                        },
                        {
                            label: 'Person',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/person/person']
                        },
                        {
                            label: 'Person-Phone',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/person/person-phone']
                        },
                        {
                            label: 'Phone-Number-Type',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/person/phone-number-type']
                        },
                        {
                            label: 'State Province',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/person/state-province']
                        }
                    ]
                },
                {
                    label: 'Production',
                    icon: 'pi pi-fw pi-warehouse',
                    items: [
                        {
                            label: 'Country Region Currency',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/sales/country-region-currency']
                        },
                        {
                            label: 'Credit Card',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/sales/credit-card']
                        },
                        {
                            label: 'Currencies',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/sales/currency']
                        },
                        {
                            label: 'Products',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'View',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['./production/admin-product-list']
                                },
                                {
                                    label: 'New',
                                    icon: 'pi pi-fw pi-user-plus',
                                    routerLink: ['./production/admin-product-new']
                                }
                            ]
                        },
                        {
                            label: 'Categories',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'View',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['./production/admin-product-category-list']
                                },
                                {
                                    label: 'New',
                                    icon: 'pi pi-fw pi-user-plus',
                                    routerLink: ['./production/admin-product-category-new']
                                }
                            ]
                        },
                        {
                            label: 'Sub Categories',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'View',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['./production/admin-product-sub-category-list']
                                },
                                {
                                    label: 'New',
                                    icon: 'pi pi-fw pi-user-plus',
                                    routerLink: ['./production/admin-product-sub-category-new']
                                }
                            ]
                        },
                    ]
                },
                {
                    label: 'Purchasing',
                    icon: 'pi pi-fw pi-sync',
                    items: [
                        {
                            label: 'Country Region Currency',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/sales/country-region-currency']
                        },
                        {
                            label: 'Credit Card',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/sales/credit-card']
                        },
                        {
                            label: 'Currencies',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/sales/currency']
                        }
                    ]
                },
                {
                    label: 'Sales',
                    icon: 'pi pi-fw pi-qrcode',
                    items: [
                        {
                            label: 'Country Region Currency',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/sales/country-region-currency']
                        },
                        {
                            label: 'Credit Card',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/sales/credit-card']
                        },
                        {
                            label: 'Currencies',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/sales/currency']
                        },
                        {
                            label: 'Currency Rate',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/sales/currency-rate']
                        }
                    ]
                }
            ]
        },
        {
            label: 'Products',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['./production/admin-product']
                },
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: ['./production/admin-product-new']
                }
            ]
        },
        {
            label: 'Orders',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search'
                }
            ]
        },
        {
            label: 'Shipments',
            icon: 'pi pi-fw pi-envelope',
            items: [
                {
                    label: 'Tracker',
                    icon: 'pi pi-fw pi-compass',
                    routerLink: ['./production/admin-shipping-tracking']
                },
                {
                    label: 'Map',
                    icon: 'pi pi-fw pi-map-marker',
                    routerLink: ['./production/admin-order-tracking-map']
                },
                {
                    label: 'Manage',
                    icon: 'pi pi-fw pi-pencil',

                }
            ]
        },
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-fw pi-cog'
                },
                {
                    label: 'Billing',
                    icon: 'pi pi-fw pi-file'
                }
            ]
        }
    ];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['admin/dashboard'] }]
            },
            {
                label: 'Store',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['pages'],
                items: [
                    {
                        label: 'Products',
                        icon: 'pi pi-fw pi-shop',
                        routerLink: ['./products']
                    },
                    {
                        label: 'Today Special',
                        icon: 'pi pi-fw pi-sparkles',
                        routerLink: ['./today-special']
                    },
                    {
                        label: 'WishList',
                        icon: 'pi pi-fw pi-shopping-bag',
                        routerLink: ['./wish-list']
                    },
                    {
                        label: 'Shopping Cart',
                        icon: 'pi pi-fw pi-cart-arrow-down',
                        routerLink: ['./shopping-cart']
                    },
                    {
                        label: 'Orders',
                        icon: 'pi pi-fw pi-cart-plus',
                        routerLink: ['./orders']
                    },
                    {
                        label: 'Check-out',
                        icon: 'pi pi-fw pi-cart-plus',
                        routerLink: ['./check-out']
                    }
                ]
            },

            {
                label: 'Apps',
                items: [
                    {
                        label: 'Blog',
                        icon: 'pi pi-fw pi-check-circle',
                        routerLink: ['/pages/blog']
                    },
                    {
                        label: 'Chat',
                        icon: 'pi pi-fw pi-check-square',
                        routerLink: ['/pages/chat']
                    },
                    {
                        label: 'Mail',
                        icon: 'pi pi-fw pi-inbox',
                        routerLink: ['/pages/mail']
                    },
                    {
                        label: 'Calendar',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/calendar']
                    },
                    {
                        label: 'Tasks',
                        icon: 'pi pi-fw pi-list-check',
                        routerLink: ['/pages/task-list']
                    },
                    {
                        label: 'Reports',
                        icon: 'pi pi-fw pi-verified',
                        routerLink: ['/pages/reports']
                    }
                ]
            },
            {
                label: 'Trading Economics',
                routerLink: ['trading-economics'],
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-gauge',
                        routerLink: ['trading-economics-dashboard']
                    },
                    {
                        label: 'Forecast',
                        icon: 'pi pi-fw pi-chevron-up',
                        routerLink: ['forecast']
                    },
                    {
                        label: 'Calendar',
                        icon: 'pi pi-fw pi-calendar-times',
                        routerLink: ['calendar']
                    },
                    {
                        label: 'News',
                        icon: 'pi pi-fw pi-history',
                        routerLink: ['news']
                    },
                    {
                        label: 'GDP Per Country',
                        icon: 'pi pi-fw pi-map-marker',
                        routerLink: ['gdp-per-country']
                    }
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/primefaces/sakai-ng',
                        target: '_blank'
                    }
                ]
            }
        ];
    }

    private cartService = inject(CartService);
    cartItemCount$: Observable<number>;

    constructor(private store: Store) {
        this.cartItemCount$ = this.store.select(selectCartItemCount);
    }
}
