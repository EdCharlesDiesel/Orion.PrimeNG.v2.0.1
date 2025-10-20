import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { Subject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { Toast } from 'primeng/toast';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { IconField } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';


class LoginRequest {
    email: string | undefined;
    password: string | undefined;
}

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        Toast,
        Card,
        Divider,
        ReactiveFormsModule, IconField, CommonModule],
    providers: [AuthService, MessageService]
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    passwordVisible = false;
    returnUrl: string = 'admin/dashboard';

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rememberMe: [false]
        });
    }

    ngOnInit(): void {
        // Redirect if already authenticated
        if (!this.authService.isAuthenticated()) {
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || './admin/dashboard';
            const navigation = this.router.getCurrentNavigation();
            if (navigation?.extras?.state?.['message']) {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Info',
                    detail: navigation.extras.state['message']
                });
            }
            this.loadSavedCredentials();
        } else {
            this.router.navigate(['./admin/dashboard']);
            return;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Getter for easy access to form fields
    get loginFormControls() {
        return this.loginForm.controls;
    }

    public onSubmit(): void {
        this.submitted = true;

        // if (this.loginForm.invalid) {
        //     this.markFormGroupTouched();
        //     return;
        // }

        this.loading = true;

        const loginData: any = {
            email: this.loginFormControls['email'].value,
            password: this.loginFormControls['password'].value
        };

        // Handle remember me functionality
        if (this.loginFormControls['rememberMe'].value) {
            this.saveCredentials(loginData.email, loginData.password);
        } else {
            this.clearSavedCredentials();
        }

        this.authService
            .login(loginData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Login Successful',
                        detail: `Welcome back, ${response.user.name}!`
                    });

                    // Redirect to return URL or dashboard

                        this.router.navigate([this.returnUrl]);

                },
                error: (error: any) => {
                    this.loading = false;
                    this.handleLoginError(error);
                },
                complete: () => {
                    this.loading = false;
                }
            });
    }

    public onForgotPassword(): void {
        if (this.loginFormControls['email'].valid) {
            const email = this.loginFormControls['email'].value;
            this.authService
                .requestPasswordReset(email)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Password Reset Sent',
                            detail: 'Please check your email for password reset instructions'
                        });
                    },
                    error: (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Reset Failed',
                            detail: error || 'Failed to send password reset email'
                        });
                    }
                });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Email Required',
                detail: 'Please enter a valid email address first'
            });
            this.loginFormControls['email'].markAsTouched();
        }
    }

    public onSocialLogin(provider: string): void {
        // Placeholder for social login implementation
        this.messageService.add({
            severity: 'info',
            summary: 'Coming Soon',
            detail: `${provider} login will be available soon`
        });

        // Example implementation:
        // this.authService.socialLogin(provider).subscribe({...});
    }

    public navigateToRegister(): void {
        this.router.navigate(['/auth/register']);
    }

    private handleLoginError(error: string): void {
        let errorMessage = 'Login failed. Please try again.';
        let severity: 'error' | 'warn' = 'error';

        if (error.toLowerCase().includes('email') || error.toLowerCase().includes('user not found')) {
            errorMessage = 'No account found with this email address';
        } else if (error.toLowerCase().includes('password') || error.toLowerCase().includes('invalid credentials')) {
            errorMessage = 'Invalid password. Please try again.';
        } else if (error.toLowerCase().includes('verification') || error.toLowerCase().includes('verify')) {
            errorMessage = 'Please verify your email address before logging in';
            severity = 'warn';
        } else if (error.toLowerCase().includes('locked') || error.toLowerCase().includes('suspended')) {
            errorMessage = 'Your account has been locked. Please contact support.';
        }

        this.messageService.add({
            severity: severity,
            summary: 'Login Failed',
            detail: errorMessage
        });
    }

    private loadSavedCredentials(): void {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            this.loginForm.patchValue({
                email: savedEmail,
                rememberMe: true
            });
        }
    }

    private saveCredentials(email: string, password: any): void {
        localStorage.setItem('rememberedEmail', email);
    }

    private clearSavedCredentials(): void {
        localStorage.removeItem('rememberedEmail');
    }

    private markFormGroupTouched(): void {
        Object.keys(this.loginForm.controls).forEach((key) => {
            const control = this.loginForm.get(key);
            control?.markAsTouched();
        });
    }

    // Helper methods for template
    public isFieldInvalid(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
    }

    public getFieldError(fieldName: string): string {
        const field = this.loginForm.get(fieldName);
        if (field?.errors && (field.dirty || field.touched || this.submitted)) {
            if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
            if (field.errors['email']) return 'Please enter a valid email address';
            if (field.errors['minlength']) return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
        }
        return '';
    }

    private getFieldDisplayName(fieldName: string): string {
        const displayNames: { [key: string]: string } = {
            email: 'Email',
            password: 'Password'
        };
        return displayNames[fieldName] || fieldName;
    }

    private togglePasswordVisibility(): void {
        this.passwordVisible = !this.passwordVisible;
    }
}
