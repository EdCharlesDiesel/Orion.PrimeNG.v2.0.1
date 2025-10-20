import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
// import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        // InputTextareaModule,
        ButtonModule,
        MessageModule,
        MessagesModule,
        DividerModule,
        AvatarModule
    ],
    template: `
    <div class="settings-page surface-ground min-h-screen py-5">
      <div class="container">
        <div class="grid">
          <div class="col-12 md:col-8 md:col-offset-2 lg:col-6 lg:col-offset-3">
            <p-card styleClass="settings-card">
              <ng-template pTemplate="header">
                <div class="card-header">
                  <div class="flex align-items-center gap-3">
                    <i class="pi pi-cog text-4xl text-primary"></i>
                    <h1 class="text-3xl font-bold text-900 m-0">Your Settings</h1>
                  </div>
                </div>
              </ng-template>

              <ng-template pTemplate="content">
                <!-- Error Messages -->
                <div *ngIf="errors().length > 0" class="mb-4">
                  <p-messages severity="error" [closable]="false">
                    <ng-template pTemplate>
                      <div class="ml-2">
                        <div *ngFor="let error of errors()" class="mb-1">
                          {{ error }}
                        </div>
                      </div>
                    </ng-template>
                  </p-messages>
                </div>

                <!-- Profile Preview -->
                <div class="profile-preview mb-4 text-center" *ngIf="settingsForm.get('image')?.value">
                  <p-avatar
                    [image]="settingsForm.get('image')?.value"
                    size="xlarge"
                    shape="circle"
                    styleClass="profile-avatar">
                  </p-avatar>
                  <p class="text-sm text-600 mt-2">Profile Picture Preview</p>
                </div>

                <form [formGroup]="settingsForm" (ngSubmit)="submitForm()">
                  <fieldset [disabled]="isSubmitting()">
                    <!-- Profile Picture URL -->
                    <div class="field mb-4">
                      <label for="image" class="block text-900 font-medium mb-2">
                        <i class="pi pi-image mr-2"></i>Profile Picture URL
                      </label>
                      <input
                        pInputText
                        id="image"
                        type="text"
                        placeholder="https://example.com/avatar.jpg"
                        formControlName="image"
                        class="w-full"
                      />
                      <small class="text-600">Enter the URL of your profile picture</small>
                    </div>

                    <!-- Username -->
                    <div class="field mb-4">
                      <label for="username" class="block text-900 font-medium mb-2">
                        <i class="pi pi-user mr-2"></i>Username
                      </label>
                      <input
                        pInputText
                        id="username"
                        type="text"
                        placeholder="Your username"
                        formControlName="username"
                        class="w-full p-inputtext-lg"
                        [class.ng-invalid]="settingsForm.get('username')?.invalid && settingsForm.get('username')?.touched"
                      />
                      <small
                        *ngIf="settingsForm.get('username')?.invalid && settingsForm.get('username')?.touched"
                        class="p-error">
                        Username is required
                      </small>
                    </div>

                    <!-- Bio -->
                    <div class="field mb-4">
                      <label for="bio" class="block text-900 font-medium mb-2">
                        <i class="pi pi-align-left mr-2"></i>Bio
                      </label>
                      <textarea
                        pInputTextarea
                        id="bio"
                        rows="6"
                        placeholder="Tell us about yourself..."
                        formControlName="bio"
                        class="w-full"
                        [autoResize]="true"
                      ></textarea>
                      <small class="text-600">
                        {{ settingsForm.get('bio')?.value?.length || 0 }} characters
                      </small>
                    </div>

                    <!-- Email -->
                    <div class="field mb-4">
                      <label for="email" class="block text-900 font-medium mb-2">
                        <i class="pi pi-envelope mr-2"></i>Email
                      </label>
                      <input
                        pInputText
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        formControlName="email"
                        class="w-full p-inputtext-lg"
                        [class.ng-invalid]="settingsForm.get('email')?.invalid && settingsForm.get('email')?.touched"
                      />
                      <small
                        *ngIf="settingsForm.get('email')?.invalid && settingsForm.get('email')?.touched"
                        class="p-error">
                        Valid email is required
                      </small>
                    </div>

                    <!-- Password -->
                    <div class="field mb-4">
                      <label for="password" class="block text-900 font-medium mb-2">
                        <i class="pi pi-lock mr-2"></i>New Password
                      </label>
                      <input
                        pInputText
                        id="password"
                        type="password"
                        placeholder="Enter new password (leave blank to keep current)"
                        formControlName="password"
                        class="w-full p-inputtext-lg"
                      />
                      <small class="text-600">Leave blank if you don't want to change it</small>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-content-end">
                      <p-button
                        type="submit"
                        label="Update Settings"
                        icon="pi pi-check"
                        [loading]="isSubmitting()"
                        [disabled]="settingsForm.invalid"
                        styleClass="p-button-lg">
                      </p-button>
                    </div>
                  </fieldset>
                </form>

                <!-- Divider -->
                <p-divider></p-divider>

                <!-- Logout Section -->
                <div class="logout-section text-center">
                  <p class="text-600 mb-3">Need a break?</p>
                  <p-button
                    label="Logout"
                    icon="pi pi-sign-out"
                    severity="danger"
                    [outlined]="true"
                    (onClick)="logout()">
                  </p-button>
                </div>
              </ng-template>
            </p-card>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    :host ::ng-deep .settings-card {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      padding: 2rem 2rem 1rem;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--surface-card) 100%);
      border-bottom: 1px solid var(--surface-border);
    }

    :host ::ng-deep .settings-card .p-card-content {
      padding: 2rem;
    }

    .field label {
      display: flex;
      align-items: center;
    }

    .field label i {
      color: var(--primary-color);
    }

    .profile-preview {
      padding: 2rem;
      background: var(--surface-50);
      border-radius: 8px;
    }

    :host ::ng-deep .profile-avatar {
      border: 4px solid var(--primary-color);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    :host ::ng-deep .p-inputtext,
    :host ::ng-deep .p-inputtextarea {
      border-radius: 6px;
    }

    :host ::ng-deep .p-inputtext:enabled:focus,
    :host ::ng-deep .p-inputtextarea:enabled:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.2rem var(--primary-color-alpha);
    }

    :host ::ng-deep .ng-invalid.ng-touched {
      border-color: var(--red-500);
    }

    .logout-section {
      padding: 1.5rem 0;
    }

    small {
      display: block;
      margin-top: 0.25rem;
    }

    .p-error {
      color: var(--red-500);
    }

    @media (max-width: 768px) {
      .card-header {
        padding: 1.5rem 1rem 0.75rem;
      }

      :host ::ng-deep .settings-card .p-card-content {
        padding: 1.5rem 1rem;
      }

      .card-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
    private fb = inject(FormBuilder);

    settingsForm!: FormGroup;
    isSubmitting = signal<boolean>(false);
    errors = signal<string[]>([]);

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.settingsForm = this.fb.group({
            image: [''],
            username: ['', Validators.required],
            bio: [''],
            email: ['', [Validators.required, Validators.email]],
            password: ['']
        });

        // Load current user settings
        this.loadUserSettings();
    }

    loadUserSettings(): void {
        // Simulate loading user data
        // Replace with actual API call
        const currentUser = {
            image: 'https://via.placeholder.com/150',
            username: 'johndoe',
            bio: 'Full-stack developer passionate about Angular and TypeScript',
            email: 'john.doe@example.com'
        };

        this.settingsForm.patchValue(currentUser);
    }

    submitForm(): void {
        if (this.settingsForm.invalid) {
            this.settingsForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        this.errors.set([]);

        const formData = this.settingsForm.value;

        // Remove password if empty (user doesn't want to change it)
        if (!formData.password) {
            delete formData.password;
        }

        // Simulate API call
        setTimeout(() => {
            // Success case
            console.log('Settings updated:', formData);
            this.isSubmitting.set(false);

            // Show success message (you can add toast here)

            // Error case example:
            // this.errors.set(['Email is already taken', 'Username must be unique']);
            // this.isSubmitting.set(false);
        }, 1500);
    }

    logout(): void {
        // Implement logout logic
        console.log('Logging out...');
        // Navigate to login page or clear auth token
    }
}
