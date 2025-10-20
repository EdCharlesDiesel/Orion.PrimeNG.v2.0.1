import { BlogPost } from '../core/models/blog.models';


export const SAMPLE_BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        title: 'Understanding Angular Signals',
        excerpt: 'Signals provide a reactive approach to managing state in Angular.',
        content: 'Full content of Angular Signals article...',
        imageUrl: 'assets/images/blog-angular-signals.jpg',
        author: 'Khotso Charles',
        date: new Date('2025-10-01'),
        readTime: '5 min read',
        tags: ['Angular', 'Signals', 'State Management'],
        featured: true,
        views: 1200,
        likes: 320,
        summary: 'Learn how Angular signals work and how they simplify reactive programming.'
    },
    {
        id: '2',
        title: 'Building Realtime Dashboards with NgRx and Signals',
        excerpt: 'Combine NgRx state management with Angular Signals for live dashboards.',
        content: 'Full content of NgRx + Signals article...',
        imageUrl: 'assets/images/blog-ngrx-signals.jpg',
        author: 'Jane Doe',
        date: new Date('2025-09-28'),
        readTime: '7 min read',
        tags: ['NgRx', 'Signals', 'Dashboard'],
        featured: false,
        views: 890,
        likes: 210,
        summary: 'Step-by-step guide to building live dashboards using NgRx and Angular Signals.'
    },
    {
        id: '3',
        title: 'PrimeNG Components for Enterprise Apps',
        excerpt: 'A practical guide to using PrimeNG for rich UI components.',
        content: 'Full content of PrimeNG article...',
        imageUrl: 'assets/images/blog-primeng.jpg',
        author: 'John Smith',
        date: new Date('2025-09-20'),
        readTime: '6 min read',
        tags: ['PrimeNG', 'UI', 'Components'],
        featured: false,
        views: 650,
        likes: 110,
        summary: 'Learn how to use PrimeNG components to build enterprise-grade Angular apps.'
    },
    {
        id: '4',
        title: 'Optimizing Angular Performance',
        excerpt: 'Tips and tricks for faster Angular applications.',
        content: 'Full content of Angular performance article...',
        imageUrl: 'assets/images/blog-angular-performance.jpg',
        author: 'Alice Johnson',
        date: new Date('2025-10-05'),
        readTime: '8 min read',
        tags: ['Angular', 'Performance', 'Optimization'],
        featured: true,
        views: 1450,
        likes: 410,
        summary: 'Best practices to make your Angular apps faster and more efficient.'
    }
];
