import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineDemoComponent } from './timelinedemo.component';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@NgModule({
    imports: [CommonModule, TimelineModule, ButtonModule, CardModule, TimelineDemoComponent],
    declarations: []
})
export class TimelineDemoModule {}
