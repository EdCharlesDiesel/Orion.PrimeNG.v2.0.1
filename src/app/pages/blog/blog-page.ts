import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CheckOutComponent } from '../../features/components/check-out/check-out.component';
import { ChatComponent } from '../../features/components/chat/chat.component';
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
