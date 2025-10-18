import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { User } from '../user.model';
import { UserDialogComponent } from './user-dialog.component';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { UserService } from '../../../../service/user.service';

@Component({
    selector: 'app-user-crud',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, CardModule, DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, UserDialogComponent],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>

        <p-card styleClass="user-card">
            <ng-template pTemplate="header">
                <div class="card-header">
                    <div class="title-section">
                        <i class="pi pi-users"></i>
                        <h2>User Management</h2>
                    </div>
                    <div class="header-actions">
                        <p-button label="Add User" icon="pi pi-plus" (onClick)="openDialog()" severity="success"> </p-button>
                    </div>
                </div>
            </ng-template>

            <ng-template pTemplate="content">
                <div *ngIf="loading()" class="loading-container">
                    <p-progressSpinner></p-progressSpinner>
                </div>

                <div *ngIf="!loading() && users().length > 0">
                    <p-table [value]="users()" [tableStyle]="{ 'min-width': '60rem' }" styleClass="p-datatable-striped">
                        <ng-template pTemplate="header">
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Actions</th>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="body" let-user>
                            <tr>
                                <td>{{ user.id }}</td>
                                <td>{{ user.username }}</td>
                                <td>{{ user.name.firstname }} {{ user.name.lastname }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.phone }}</td>
                                <td>{{ user.address.city }}</td>
                                <td>
                                    <p-button icon="pi pi-pencil" severity="info" [rounded]="true" [text]="true" (onClick)="openDialog(user)" pTooltip="Edit"> </p-button>
                                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [text]="true" (onClick)="deleteUser(user.id)" pTooltip="Delete"> </p-button>
                                </td>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="7" class="no-data">
                                    <i class="pi pi-users" style="font-size: 3rem"></i>
                                    <p>No users found</p>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>

                <div *ngIf="!loading() && users().length === 0" class="no-data">
                    <i class="pi pi-users" style="font-size: 3rem"></i>
                    <p>No users found</p>
                </div>
            </ng-template>
        </p-card>

        <!-- User Dialog -->
        <p-dialog [(visible)]="displayDialog" [header]="dialogUser ? 'Edit User' : 'Add User'" [modal]="true" [style]="{ width: '600px' }" [draggable]="false" [resizable]="false">
            <ng-template pTemplate="content">
                <app-user-dialog [user]="dialogUser" (save)="onDialogSave($event)" (cancel)="displayDialog = false"> </app-user-dialog>
            </ng-template>
        </p-dialog>
    `,
    styles: [
        `
            :host ::ng-deep .user-card {
                margin: 2rem auto;
                max-width: 1400px;
            }

            :host ::ng-deep .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                background: var(--surface-50);
            }

            .title-section {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .title-section i {
                font-size: 1.5rem;
                color: var(--primary-color);
            }

            .title-section h2 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }

            .header-actions {
                display: flex;
                gap: 1rem;
            }

            .loading-container {
                display: flex;
                justify-content: center;
                padding: 3rem;
            }

            .no-data {
                text-align: center;
                padding: 3rem;
                color: var(--text-color-secondary);
            }

            .no-data p {
                margin-top: 1rem;
                font-size: 1.1rem;
            }

            :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
                padding: 1rem;
            }

            :host ::ng-deep .p-button.p-button-text {
                margin: 0 0.25rem;
            }
        `
    ]
})
export class UserCrudComponent implements OnInit {
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    users = signal<User[]>([]);
    loading = signal<boolean>(false);
    displayDialog = false;
    dialogUser: User | null = null;

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading.set(true);
        // this.userService.getUsers().subscribe({
        //     next: (data) => {
        //         this.users.set(data);
        //         this.loading.set(false);
        //     },
        //     error: (error) => {
        //         this.showMessage('error', 'Error', 'Error loading users');
        //         this.loading.set(false);
        //     }
        // });
    }

    openDialog(user?: User): void {
        this.dialogUser = user || null;
        this.displayDialog = true;
    }

    onDialogSave(user: User): void {
        if (user.id) {
            this.updateUser(user);
        } else {
            this.createUser(user);
        }
        this.displayDialog = false;
    }

    createUser(user: Partial<User>): void {
        // this.userService.createUser(user).subscribe({
        //     next: (newUser) => {
        //         this.users.update((users) => [...users, newUser]);
        //         this.showMessage('success', 'Success', 'User created successfully');
        //     },
        //     error: () => this.showMessage('error', 'Error', 'Error creating user')
        // });
    }

    updateUser(user: User): void {
        // this.userService.updateUser(user.id, user).subscribe({
        //     next: (updatedUser) => {
        //         this.users.update((users) => users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        //         this.showMessage('success', 'Success', 'User updated successfully');
        //     },
        //     error: () => this.showMessage('error', 'Error', 'Error updating user')
        // });
    }

    deleteUser(id: number): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this user?',
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.userService.deleteUser(id).subscribe({
                    next: () => {
                        this.users.update((users) => users.filter((u) => u.id !== id));
                        this.showMessage('success', 'Success', 'User deleted successfully');
                    },
                    error: () => this.showMessage('error', 'Error', 'Error deleting user')
                });
            }
        });
    }

    logout(): void {
        this.authService.logout();
    }

    private showMessage(severity: string, summary: string, detail: string): void {
        this.messageService.add({ severity, summary, detail, life: 3000 });
    }
}
