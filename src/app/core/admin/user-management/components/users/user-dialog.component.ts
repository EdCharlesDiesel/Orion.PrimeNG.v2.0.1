import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { User } from '../user.model';

@Component({
    selector: 'app-user-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        FloatLabelModule
    ],
    template: `
        <form #userForm="ngForm" class="user-form">
            <div class="form-grid">
                <div class="field">
                    <label for="username">Username</label>
                    <input
                        pInputText
                        id="username"
                        [(ngModel)]="formData.username"
                        name="username"
                        required
                        class="w-full">
                </div>

                <div class="field">
                    <label for="email">Email</label>
                    <input
                        pInputText
                        id="email"
                        type="email"
                        [(ngModel)]="formData.email"
                        name="email"
                        required
                        class="w-full">
                </div>

                <div class="field">
                    <label for="firstname">First Name</label>
                    <input
                        pInputText
                        id="firstname"
                        [(ngModel)]="formData.name.firstname"
                        name="firstname"
                        required
                        class="w-full">
                </div>

                <div class="field">
                    <label for="lastname">Last Name</label>
                    <input
                        pInputText
                        id="lastname"
                        [(ngModel)]="formData.name.lastname"
                        name="lastname"
                        required
                        class="w-full">
                </div>

                <div class="field">
                    <label for="phone">Phone</label>
                    <input
                        pInputText
                        id="phone"
                        [(ngModel)]="formData.phone"
                        name="phone"
                        required
                        class="w-full">
                </div>

                <div class="field">
                    <label for="city">City</label>
                    <input
                        pInputText
                        id="city"
                        [(ngModel)]="formData.address.city"
                        name="city"
                        required
                        class="w-full">
                </div>

                <div class="field">
                    <label for="street">Street</label>
                    <input
                        pInputText
                        id="street"
                        [(ngModel)]="formData.address.street"
                        name="street"
                        required
                        class="w-full">
                </div>

                <div class="field">
                    <label for="zipcode">Zipcode</label>
                    <input
                        pInputText
                        id="zipcode"
                        [(ngModel)]="formData.address.zipcode"
                        name="zipcode"
                        required
                        class="w-full">
                </div>
            </div>

            <div class="dialog-actions">
                <p-button
                    label="Cancel"
                    icon="pi pi-times"
                    severity="secondary"
                    [outlined]="true"
                    (onClick)="onCancel()">
                </p-button>
                <p-button
                    label="Save"
                    icon="pi pi-check"
                    severity="success"
                    (onClick)="onSave()"
                    [disabled]="!userForm.valid">
                </p-button>
            </div>
        </form>
    `,
    styles: [`
        .user-form {
            padding: 1rem;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .field {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .field label {
            font-weight: 600;
            color: var(--text-color);
            font-size: 0.875rem;
        }

        .w-full {
            width: 100%;
        }

        :host ::ng-deep .p-inputtext {
            width: 100%;
        }

        .dialog-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            padding-top: 1rem;
            border-top: 1px solid var(--surface-border);
        }

        @media (max-width: 768px) {
            .form-grid {
                grid-template-columns: 1fr;
            }
        }
    `]
})
export class UserDialogComponent implements OnInit {
    @Input() user: User | null = null;
    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    formData: any = {
        id: null,
        username: '',
        email: '',
        password: 'password123',
        name: {
            firstname: '',
            lastname: ''
        },
        address: {
            city: '',
            street: '',
            number: 0,
            zipcode: '',
            geolocation: {
                lat: '-37.3159',
                long: '81.1496'
            }
        },
        phone: ''
    };

    ngOnInit(): void {
        if (this.user) {
            this.formData = {
                id: this.user.id,
                username: this.user.username || '',
                email: this.user.email || '',
                password: this.user.password || 'password123',
                name: {
                    firstname: this.user.name?.firstname || '',
                    lastname: this.user.name?.lastname || ''
                },
                address: {
                    city: this.user.address?.city || '',
                    street: this.user.address?.street || '',
                    number: this.user.address?.number || 0,
                    zipcode: this.user.address?.zipcode || '',
                    geolocation: {
                        lat: this.user.address?.geolocation?.lat || '-37.3159',
                        long: this.user.address?.geolocation?.long || '81.1496'
                    }
                },
                phone: this.user.phone || ''
            };
        }
    }

    onCancel(): void {
        this.cancel.emit();
    }

    onSave(): void {
        this.save.emit(this.formData);
    }
}
