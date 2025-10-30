// src/app/services/blog.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { BlogPost } from '../core/models/blog.models';

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private apiUrl = '/api/blog'; // Replace with your actual API URL

    // Mock data for demonstration
    private mockPosts: BlogPost[] = [
        {
            id: '1',
            title: 'Getting Started with Angular 18',
            excerpt: 'Learn the fundamentals of Angular 18 and discover the new features that make development faster and more efficient.',
            content: 'Full content here...',
            imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
            author: 'Sarah Johnson',
            date: new Date('2024-10-01'),
            readTime: '8 min read',
            tags: ['Angular', 'Web Development', 'TypeScript'],
            featured: true,
            views: 1250,
            likes: 45,
            summary:"summary"
        },
        {
            id: '2',
            title: 'Mastering RxJS Operators',
            excerpt: 'Deep dive into the most useful RxJS operators and learn how to handle asynchronous data streams effectively.',
            content: 'Full content here...',
            imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
            author: 'Michael Chen',
            date: new Date('2024-09-28'),
            readTime: '12 min read',
            tags: ['RxJS', 'JavaScript', 'Reactive Programming'],
            views: 890,
            likes: 32,
            summary:"summary"
        },
        {
            id: '3',
            title: 'State Management Best Practices',
            excerpt: 'Explore different state management solutions and learn when to use each approach in your Angular applications.',
            content: 'Full content here...',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
            author: 'Emily Rodriguez',
            date: new Date('2024-09-25'),
            readTime: '10 min read',
            tags: ['Angular', 'State Management', 'NgRx'],
            views: 1100,
            likes: 56,
            summary:"summary"
        },
        {
            id: '4',
            title: 'Building Accessible Web Applications',
            excerpt: 'Essential techniques and tools for creating inclusive web applications that everyone can use.',
            content: 'Full content here...',
            imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop',
            author: 'David Park',
            date: new Date('2024-09-20'),
            readTime: '7 min read',
            tags: ['Accessibility', 'Web Development', 'UX'],
            views: 750,
            likes: 28,
            summary:"summary"
        },
        {
            id: '5',
            title: 'Performance Optimization Techniques',
            excerpt: 'Boost your Angular application performance with these proven optimization strategies and best practices.',
            content: 'Full content here...',
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
            author: 'Lisa Anderson',
            date: new Date('2024-09-15'),
            readTime: '15 min read',
            tags: ['Performance', 'Angular', 'Optimization'],
            views: 1450,
            likes: 67,
            summary:"summary"
        },
        {
            id: '6',
            title: 'Testing Angular Applications',
            excerpt: 'Comprehensive guide to unit testing, integration testing, and e2e testing in Angular applications.',
            content: 'Full content here...',
            imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
            author: 'James Wilson',
            date: new Date('2024-09-10'),
            readTime: '11 min read',
            tags: ['Testing', 'Angular', 'Jest', 'Cypress'],
            views: 980,
            likes: 41,
            summary:"summary"
        }
    ];

    constructor(private http: HttpClient) {}

    // Get all posts
    getAllPosts(): Observable<BlogPost[]> {
        // Replace with actual HTTP call in production
        // return this.http.get<BlogPost[]>(`${this.apiUrl}/posts`);

        // Mock implementation
        return of(this.mockPosts).pipe(delay(1000));
    }

    // Get post by ID
    getPostById(id: string): Observable<BlogPost> {
        // Replace with actual HTTP call in production
        // return this.http.get<BlogPost>(`${this.apiUrl}/posts/${id}`);

        // Mock implementation
        const post = this.mockPosts.find(p => p.id === id);
        if (!post) {
            throw new Error('Post not found');
        }
        return of(post).pipe(delay(500));
    }

    // Create new post
    createPost(post: Omit<BlogPost, 'id'>): Observable<BlogPost> {
        // Replace with actual HTTP call in production
        // return this.http.post<BlogPost>(`${this.apiUrl}/posts`, post);

        // Mock implementation
        const newPost: BlogPost = {
            ...post,
            id: Date.now().toString(),
            views: 0,
            likes: 0
        };
        this.mockPosts.push(newPost);
        return of(newPost).pipe(delay(800));
    }

    // Update post
    updatePost(id: string, changes: Partial<BlogPost>): Observable<BlogPost> {
        // Replace with actual HTTP call in production
        // return this.http.patch<BlogPost>(`${this.apiUrl}/posts/${id}`, changes);

        // Mock implementation
        const index = this.mockPosts.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Post not found');
        }
        this.mockPosts[index] = { ...this.mockPosts[index], ...changes };
        return of(this.mockPosts[index]).pipe(delay(800));
    }

    // Delete post
    deletePost(id: string): Observable<void> {
        // Replace with actual HTTP call in production
        // return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);

        // Mock implementation
        const index = this.mockPosts.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Post not found');
        }
        this.mockPosts.splice(index, 1);
        return of(void 0).pipe(delay(500));
    }

    // Like post
    likePost(id: string): Observable<number> {
        // Replace with actual HTTP call in production
        // return this.http.post<number>(`${this.apiUrl}/posts/${id}/like`, {});

        // Mock implementation
        const post = this.mockPosts.find(p => p.id === id);
        if (!post) {
            throw new Error('Post not found');
        }
        post.likes = (post.likes || 0) + 1;
        return of(post.likes).pipe(delay(300));
    }

    // Search posts
    searchPosts(query: string): Observable<BlogPost[]> {
        // Replace with actual HTTP call in production
        const params = new HttpParams().set('q', query);
        // return this.http.get<BlogPost[]>(`${this.apiUrl}/posts/search`, { params });

        // Mock implementation
        const results = this.mockPosts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase())
        );
        return of(results).pipe(delay(500));
    }

    // Get posts by tag
    getPostsByTag(tag: string): Observable<BlogPost[]> {
        // Replace with actual HTTP call in production
        // return this.http.get<BlogPost[]>(`${this.apiUrl}/posts/tag/${tag}`);

        // Mock implementation
        const results = this.mockPosts.filter(post => post.tags.includes(tag));
        return of(results).pipe(delay(500));
    }

    // Get posts by author
    getPostsByAuthor(author: string): Observable<BlogPost[]> {
        // Replace with actual HTTP call in production
        // return this.http.get<BlogPost[]>(`${this.apiUrl}/posts/author/${author}`);

        // Mock implementation
        const results = this.mockPosts.filter(post => post.author === author);
        return of(results).pipe(delay(500));
    }
}
