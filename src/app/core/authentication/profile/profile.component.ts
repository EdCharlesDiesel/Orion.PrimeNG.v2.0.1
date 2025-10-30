import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { takeUntil } from 'rxjs/operators';
import { Tag } from 'primeng/tag';
import { CommonModule, DatePipe, } from '@angular/common';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { TabPanel, TabView } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitch } from 'primeng/inputswitch';
// import { DropdownModule } from 'primeng/dropdown';

interface ProfileStats {
    loginCount: number;
    lastLogin: Date;
    accountCreated: Date;
    role: string;
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: true,
    imports: [FormsModule, Tag, DatePipe, ReactiveFormsModule, Button, InputText, CommonModule, Password, ConfirmDialog, Toast, FileUploadModule, TabView, TabPanel, DropdownModule, InputSwitch],
    providers: [ConfirmationService, MessageService]
})
class ProfileComponent implements OnInit, OnDestroy {
    private readonly formBuilder = inject(FormBuilder);
    user: any | null = null;
    profileForm: FormGroup | any;
    passwordForm: FormGroup | any;
    timezones = [
        { label: 'UTC', value: 'UTC' },
        { label: 'America/New_York', value: 'America/New_York' },
        { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
        { label: 'Europe/London', value: 'Europe/London' },
        { label: 'Asia/Tokyo', value: 'Asia/Tokyo' }
    ];

    // UI State
    editMode = false;
    loading = false;
    passwordLoading = false;
    uploadingAvatar = false;
    activeTab = 0;

    // Profile data
    profileStats: ProfileStats = {
        loginCount: 0,
        lastLogin: new Date(),
        accountCreated: new Date(),
        role: 'user'
    };

    // Avatar
    selectedAvatar: File | null = null;
    avatarPreview: string | null = null;

    private destroy$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {
        this.initializeForms();
    }

    ngOnInit(): void {
        this.loadUserData();
        this.loadProfileStats();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeForms(): void {
        this.profileForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.pattern(/^\+?[\d\s\-()]+$/)]],
            bio: ['', [Validators.maxLength(500)]],
            company: [''],
            position: [''],
            location: [''],
            website: ['', [Validators.pattern(/^https?:\/\/.+/)]],
            timezone: ['UTC'],
            language: ['en'],
            notifications: this.formBuilder.group({
                email: [true],
                push: [true],
                sms: [false],
                marketing: [false]
            }),
            privacy: this.formBuilder.group({
                profileVisible: [true],
                showEmail: [false],
                showPhone: [false]
            })
        });

        this.passwordForm = this.formBuilder.group(
            {
                currentPassword: ['', [Validators.required]],
                newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)]],
                confirmPassword: ['', [Validators.required]]
            },
            {
                validators: this.passwordMatchValidator
            }
        );
    }

    private loadUserData(): void {
        this.user = this.authService.getCurrentUser();
        if (this.user) {
            this.populateProfileForm();
        } else {
            this.router.navigate(['/login']).then();
        }
    }

    private loadProfileStats(): void {
        // In a real app, this would come from an API
        this.profileStats = {
            loginCount: 127,
            lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            accountCreated: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
            role: this.user?.role || 'user'
        };
    }

    private populateProfileForm(): void {
        if (this.user) {
            this.profileForm.patchValue({
                name: this.user.name,
                email: this.user.username,
                phone: '+1 (555) 123-4567',
                bio: 'Software developer passionate about creating amazing user experiences.',
                company: 'Tech Corp',
                position: 'Senior Developer',
                location: 'San Francisco, CA',
                website: 'https://johndoe.dev',
                timezone: 'America/Los_Angeles',
                language: 'en'
            });
        }
    }

    // Form validation
    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword');
        const confirmPassword = form.get('confirmPassword');

        if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }

        if (confirmPassword?.hasError('passwordMismatch')) {
            delete confirmPassword.errors!['passwordMismatch'];
            confirmPassword.updateValueAndValidity({ emitEvent: false });
        }

        return null;
    }

    toggleEditMode(): void {
        this.editMode = !this.editMode;
        if (!this.editMode) {
            this.populateProfileForm();
        }
    }

    onSaveProfile(): void {
        if (this.profileForm.valid) {
            this.loading = true;
            const formData = this.profileForm.value;

            const userData: Partial<User> = {
                name: formData.name,
                emailAddress: formData.email,
                phoneNumber: formData.phone,
                bio: formData.bio,
                company: formData.company,
                position: formData.position,
                location: formData.location,
                website: formData.website
            };

            this.authService
                .updateProfile(userData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (updatedUser) => {
                        this.user = updatedUser;
                        this.editMode = false;
                        this.loading = false;

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Profile Updated',
                            detail: 'Your profile has been updated successfully'
                        });
                    },
                    error: (error) => {
                        this.loading = false;

                        const errorMessage = error?.error?.message || error?.message || 'Failed to update profile';

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Update Failed',
                            detail: errorMessage
                        });
                    }
                });
        } else {
            this.markFormGroupTouched(this.profileForm);
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields correctly'
            });
        }
    }

    onChangePassword(): void {
        if (this.passwordForm.invalid) {
            this.markFormGroupTouched(this.passwordForm);
            return;
        }

        this.passwordLoading = true;
        const { currentPassword, newPassword } = this.passwordForm.value;

        this.authService
            .changePassword(currentPassword, newPassword)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.passwordForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Password Changed',
                        detail: 'Your password has been changed successfully'
                    });
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Password Change Failed',
                        detail: error || 'Failed to change password'
                    });
                },
                complete: () => {
                    this.passwordLoading = false;
                }
            });
    }

    onAvatarSelect(event: any): void {
        const file = event.files[0];
        if (file) {
            this.selectedAvatar = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.avatarPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        this.onAvatarUpload();
    }

    onAvatarUpload(): void {
        if (!this.selectedAvatar) return;
        this.uploadingAvatar = true;

        this.messageService.add({
            severity: 'success',
            summary: 'Avatar Updated',
            detail: 'Your profile picture has been updated'
        });
        this.uploadingAvatar = false;
        this.selectedAvatar = null;
        this.onAvatarClear();
    }

    private onAvatarClear(): void {
        this.selectedAvatar = null;
        this.avatarPreview = null;
    }

    onDeactivateAccount(): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to deactivate your account? This action cannot be undone.',
            header: 'Deactivate Account',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Account Deactivated',
                    detail: 'Your account has been deactivated'
                });
            }
        });
    }

    onDeleteAccount(): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete your account? This action is permanent and cannot be undone.',
            header: 'Delete Account',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Account Deletion',
                    detail: 'Account deletion request submitted'
                });
            }
        });
    }

    onExportData(): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Data Export',
            detail: 'Your data export will be emailed to you shortly'
        });
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            control?.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    isFieldInvalid(formGroup: FormGroup, fieldName: string): boolean {
        const field = formGroup.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(formGroup: FormGroup, fieldName: string): string {
        const field = formGroup.get(fieldName);
        if (field?.errors && (field.dirty || field.touched)) {
            if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
            if (field.errors['email']) return 'Please enter a valid email address';
            if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
            if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} characters allowed`;
            if (field.errors['pattern']) {
                if (fieldName === 'phone') return 'Please enter a valid phone number';
                if (fieldName === 'website') return 'Please enter a valid URL (starting with http:// or https://)';
                if (fieldName === 'newPassword') return 'Password must contain at least one uppercase, lowercase, number, and special character';
            }
            if (field.errors['passwordMismatch']) return 'Passwords do not match';
        }
        return '';
    }

    private getFieldDisplayName(fieldName: string): string {
        const displayNames: { [key: string]: string } = {
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            bio: 'Bio',
            company: 'Company',
            position: 'Position',
            location: 'Location',
            website: 'Website',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password'
        };
        return displayNames[fieldName] || fieldName;
    }
}

export default ProfileComponent;
