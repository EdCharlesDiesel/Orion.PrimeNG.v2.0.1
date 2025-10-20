import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BlogPost } from '../../../core/models/blog.models'; // adjust path if needed
import * as BlogActions from '../../../store/blog/blog.actions';
import * as BlogSelectors from '../../../store/blog/blog.selectors';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Chip } from 'primeng/chip';
import { Avatar } from 'primeng/avatar';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Skeleton } from 'primeng/skeleton';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    imports: [FormsModule, Card, PrimeTemplate, Chip, Avatar, DatePipe, Button, RouterLink, Skeleton, NgIf, NgForOf, InputText],
    providers: [MessageService]
})
export class BlogComponent implements OnInit {
    // Local signals for search query
    searchQuery = signal<string>('');

    // Selectors from NgRx
    blogPosts$!: Observable<BlogPost[]>;
    featuredPost$!: Observable<BlogPost | null>;
    loading$!: Observable<boolean>;

    // Convert observables to signals for simpler template binding
    blogPosts = signal<BlogPost[]>([]);
    featuredPost = signal<BlogPost | null>(null);
    loading = signal<boolean>(false);

    constructor(
        private store: Store,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        // Dispatch to load posts
        this.store.dispatch(BlogActions.BlogActions.loadPosts());

        // Connect store observables to signals
        this.blogPosts$ = this.store.select(BlogSelectors.selectFilteredPosts);
        this.featuredPost$ = this.store.select(BlogSelectors.selectFeaturedPost);
        this.loading$ = this.store.select(BlogSelectors.selectLoading);

        // Keep signals in sync
        effect(() => {
            this.blogPosts$.subscribe((posts) => this.blogPosts.set(posts));
            this.featuredPost$.subscribe((post) => this.featuredPost.set(post));
            this.loading$.subscribe((loading) => this.loading.set(loading));
        });

        // Filter posts whenever searchQuery changes
        effect(() => {
             // this.store.dispatch(BlogActions.BlogActions.setFilters({ query: this.searchQuery() }));
        });
    }

    // Sharing feature for social actions
    sharePost(post: BlogPost, event: Event) {
        event.stopPropagation();
        const shareText = `Check out this article: ${post.title}`;
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: shareText,
                url: window.location.origin + '/blog/' + post.id
            });
        } else {
            navigator.clipboard.writeText(shareText);
            this.messageService.add({
                severity: 'info',
                summary: 'Link Copied',
                detail: 'Article link copied to clipboard!'
            });
        }
    }
}
