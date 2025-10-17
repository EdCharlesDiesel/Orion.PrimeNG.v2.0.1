import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { selectCartItemCount } from '../../store/cart/cart.selectors';
import { Store } from '@ngrx/store';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../core/authentication/services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

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
                        routerLink: ['./pages/products']
                    },
                    {
                        label: 'Today Special',
                        icon: 'pi pi-fw pi-sparkles',
                        routerLink: ['./pages/product-demo']
                    },
                    {
                        label: 'WishList',
                        icon: 'pi pi-fw pi-shopping-bag',
                        routerLink: ['./pages/all-product']
                    },
                    {
                        label: 'Shopping Cart',
                        icon: 'pi pi-fw pi-cart-arrow-down',
                        routerLink: ['./pages/shopping-cart']
                    },
                    {
                        label: 'Check-out',
                        icon: 'pi pi-fw pi-cart-plus',
                        routerLink: ['./pages/check-out']
                    }
                ]
            },
            {
                label: 'Admin',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/human-resources'],
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
                            },         {
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
                            }
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
                            }
                        ]
                    },
                ]
            },
            {
                label: 'Apps',
                items: [
                    {
                        label: 'Blog',
                        icon: 'pi pi-fw pi-check-circle',
                        routerLink: ['/blog']
                    },
                    {
                        label: 'Chat',
                        icon: 'pi pi-fw pi-check-square',
                        routerLink: ['/chat']
                    },
                    {
                        label: 'Mail',
                        icon: 'pi pi-fw pi-inbox',
                        routerLink: ['/mail']
                    },
                    {
                        label: 'Calendar',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/calendar']
                    },
                    {
                        label: 'Tasks',
                        icon: 'pi pi-fw pi-list-check',
                        routerLink: ['/task-list']
                    }                    ,
                    {
                        label: 'Reports',
                        icon: 'pi pi-fw pi-verified',
                        routerLink: ['/reports']
                    }
                ]
            },
            {
                label: 'Trading Economics',
                items: [
                    {
                        label: 'Forecast',
                        icon: 'pi pi-fw pi-flag',
                        routerLink: ['/gdp-per-country/gdp']
                    },
                    {
                        label: 'Calendar',
                        icon: 'pi pi-fw pi-flag',
                        routerLink: ['/gdp-per-country/gdp']
                    },
                    {
                        label: 'News',
                        icon: 'pi pi-fw pi-flag',
                        routerLink: ['/gdp-per-country/gdp']
                    },     {
                        label: 'GDP Per Country',
                        icon: 'pi pi-fw pi-flag',
                        routerLink: ['/gdp-per-country/gdp']
                    },
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
