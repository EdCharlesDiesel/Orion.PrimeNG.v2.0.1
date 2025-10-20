import { Component, OnInit } from '@angular/core';
import { Toast } from 'primeng/toast';
import { Card } from 'primeng/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Password } from 'primeng/password';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { NgIf } from '@angular/common';
import { IconField } from 'primeng/iconfield';
import { InputText } from 'primeng/inputtext';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    standalone: true,
    imports: [Toast, Card, ReactiveFormsModule, Password, Checkbox, Button, Divider, NgIf, IconField, InputText],
    styleUrls: ['./register.component.scss'],
    providers: [AuthService, MessageService]
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    passwordVisible = false;
    confirmPasswordVisible = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.registerForm = this.formBuilder.group(
            {
                name: ['', [Validators.required, Validators.minLength(2)]],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)]],
                confirmPassword: ['', Validators.required],
                acceptTerms: [false, Validators.requiredTrue]
            },
            {
                validators: this.passwordMatchValidator
            }
        );
    }

    ngOnInit(): void {
        // Redirect if already authenticated
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
        }
    }

    // Custom validator for password match
    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }

        if (confirmPassword?.hasError('passwordMismatch')) {
            delete confirmPassword.errors!['passwordMismatch'];
            confirmPassword.updateValueAndValidity({ emitEvent: false });
        }

        return null;
    }

    // Getter for easy access to form fields
    get registerFormControls() {
        return this.registerForm.controls;
    }

    public onSubmit(): void {
        this.submitted = true;

        if (this.registerForm.invalid) {
            this.markFormGroupTouched();
            return;
        }

        this.loading = true;

        let registerData: any = {
            name: this.registerFormControls['name'].value.trim(),
            email: this.registerFormControls['email'].value.trim().toLowerCase(),
            password: this.registerFormControls['password'].value
        };

        this.authService.register(registerData).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Registration Successful',
                    detail: 'Your account has been created successfully!'
                });

                // Redirect to dashboard or login page

                    this.router.navigate(['/login']);

            },
            error: (error: any) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Registration Failed',
                    detail: error || 'An error occurred during registration'
                });
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    togglePasswordVisibility(): void {
        this.passwordVisible = !this.passwordVisible;
    }

    toggleConfirmPasswordVisibility(): void {
        this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }

    navigateToLogin(): void {
        this.router.navigate(['/auth/login']);
    }

    private markFormGroupTouched(): void {
        Object.keys(this.registerForm.controls).forEach((key) => {
            const control = this.registerForm.get(key);
            control?.markAsTouched();
        });
    }

    // Helper methods for template
    isFieldInvalid(fieldName: string): boolean {
        const field = this.registerForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
    }

    getFieldError(fieldName: string): string {
        const field = this.registerForm.get(fieldName);
        if (field?.errors && (field.dirty || field.touched || this.submitted)) {
            if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
            if (field.errors['email']) return 'Please enter a valid email address';
            if (field.errors['minlength']) return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
            if (field.errors['pattern']) return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
            if (field.errors['passwordMismatch']) return 'Passwords do not match';
        }
        return '';
    }

    private getFieldDisplayName(fieldName: string): string {
        const displayNames: { [key: string]: string } = {
            name: 'Name',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password'
        };
        return displayNames[fieldName] || fieldName;
    }

}
