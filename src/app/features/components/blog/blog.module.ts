import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BlogComponent } from './blog.component';

@NgModule({
    imports: [CommonModule, ButtonModule, BlogComponent],
    declarations: []
})
export class BlogModule {}
