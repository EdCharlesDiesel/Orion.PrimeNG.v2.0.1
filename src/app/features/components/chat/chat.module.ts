
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    FormsModule,
    ProgressBarModule,
    TooltipModule,
    ToastModule,
    ProgressSpinnerModule,
    RippleModule,
  ]
})
export class ChatModule {
}
