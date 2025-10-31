import { Component } from '@angular/core';
import { BlogComponent } from '../../features/components/blog/blog.component';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-blog-page',
    standalone: true,
    imports: [BlogComponent, Card],
    template: `
        <p-card>
            <app-blog></app-blog>
        </p-card>
    `
})
export class BlogPage {}
