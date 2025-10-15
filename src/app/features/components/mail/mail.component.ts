import { Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-mail',
    templateUrl: './mail.component.html',
    imports: [ButtonDirective, Ripple, NgOptimizedImage]
})
export class MailComponent {}
