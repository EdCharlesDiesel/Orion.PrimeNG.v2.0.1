import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        ButtonModule,
        MessageModule,
        DividerModule,
        AvatarModule
    ],
    templateUrl:'./settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    settingsForm!: FormGroup;
    isSubmitting = signal<boolean>(false);
    errors = signal<string[]>([]);
    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.settingsForm = this.formBuilder.group({
            image: [''],
            username: ['', Validators.required],
            bio: [''],
            email: ['', [Validators.required, Validators.email]],
            password: ['']
        });
        this.loadUserSettings();
    }

    loadUserSettings(): void {
        const currentUser = {
            image: 'https://via.placeholder.com/150',
            username: 'edcharles',
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
        if (!formData.password) {
            delete formData.password;
        }

        console.log('Settings updated:', formData);
        this.isSubmitting.set(false);

        this.errors.set(['Email is already taken', 'Username must be unique']);
        this.isSubmitting.set(false);

    }

    logout(): void {
        console.log('Logging out...');
    }
}
