import { Component, OnInit, signal, effect } from '@angular/core';
import { BlogPost } from '../../../core/models/blog.models';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Chip } from 'primeng/chip';
import { Avatar } from 'primeng/avatar';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Skeleton } from 'primeng/skeleton';
import { InputText } from 'primeng/inputtext';
import { SAMPLE_BLOG_POSTS } from '../../../mock/sample-blog-data';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    imports: [FormsModule, Card, PrimeTemplate, Chip, Avatar, DatePipe, Button, RouterLink, Skeleton, InputText, NgOptimizedImage],
    providers: [MessageService]
})
export class BlogComponent implements OnInit {
    public searchQuery = signal<string>('');
    public blogPosts = signal<BlogPost[]>([]);
    public featuredPost = signal<BlogPost | null>(null);
    public loading = signal<boolean>(false);

    constructor(private messageService: MessageService) {}

    ngOnInit(): void {
        this.loading.set(true);
        this.blogPosts.set(SAMPLE_BLOG_POSTS);
        this.featuredPost.set(SAMPLE_BLOG_POSTS.find((p) => p.featured) || null);
        this.loading.set(false);

        effect(() => {
            const query = this.searchQuery().toLowerCase();
            const filtered = SAMPLE_BLOG_POSTS.filter((p) => p.title.toLowerCase().includes(query) || p.summary.toLowerCase().includes(query) || p.tags.some((tag) => tag.toLowerCase().includes(query)));
            this.blogPosts.set(filtered);
            this.featuredPost.set(filtered.find((p) => p.featured) || null);
        });
    }

    public sharePost(post: BlogPost, event: Event) {
        event.stopPropagation();
        const shareText = `Check out this article: ${post.title}`;
        if (navigator.share) {
            navigator
                .share({
                    title: post.title,
                    text: shareText,
                    url: window.location.origin + '/blog/' + post.id
                })
                .then(() => {});
        } else {
            navigator.clipboard.writeText(shareText).then();
            this.messageService.add({
                severity: 'info',
                summary: 'Link Copied',
                detail: 'Article link copied to clipboard!'
            });
        }
    }
}
