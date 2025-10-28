// wish-list-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { WishListItem } from '../../../core/models/wish-list-item.model';


@Component({
    selector: 'wish-list-item',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, TagModule],
    template: `
    <p-card [style]="{'margin-bottom': '1rem'}">
      <ng-template pTemplate="header">
        <div class="card-header">
          <h4>{{ item.title }}</h4>
          <p-tag
            [value]="item.priority"
            [severity]="getPrioritySeverity(item.priority)">
          </p-tag>
        </div>
      </ng-template>

      <p class="description">{{ item.description }}</p>

      <div class="item-details">
        <div class="detail-row">
          <i class="pi pi-tag"></i>
          <span>{{ item.category }}</span>
        </div>
        <div class="detail-row" *ngIf="item.price">
          <i class="pi pi-dollar"></i>
<!--          <span>{{ item.price.toFixed(2) }}</span>-->
        </div>
        <div class="detail-row">
          <i class="pi pi-calendar"></i>
          <span>{{ item.addedDate | date:'mediumDate' }}</span>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="card-footer">
          <div class="action-buttons">
            <p-button
              icon="pi pi-pencil"
              styleClass="p-button-text p-button-secondary"
              (click)="edit.emit(item)">
            </p-button>
            <p-button
              [icon]="item.isPurchased ? 'pi pi-shopping-bag' : 'pi pi-check'"
              [styleClass]="item.isPurchased ?
                'p-button-text p-button-warning' :
                'p-button-text p-button-success'"
              (click)="togglePurchased.emit(item)">
            </p-button>
            <p-button
              icon="pi pi-trash"
              styleClass="p-button-text p-button-danger"
              (click)="delete.emit(item)">
            </p-button>
          </div>
        </div>
      </ng-template>
    </p-card>
  `
})
export class WishListItemComponent {
    @Input() item!: WishListItem;
    @Output() edit = new EventEmitter<WishListItem>();
    @Output() delete = new EventEmitter<WishListItem>();
    @Output() togglePurchased = new EventEmitter<WishListItem>();

    getPrioritySeverity(priority: string): any {
        switch (priority) {
            case 'High': return 'danger';
            case 'Medium': return 'warning';
            case 'Low': return 'success';
            default: return 'info';
        }
    }
}
