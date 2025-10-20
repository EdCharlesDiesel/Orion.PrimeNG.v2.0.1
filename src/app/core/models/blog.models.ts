// src/app/store/blog/blog.models.ts

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    author: string;
    date: Date;
    readTime: string;
    tags: string[];
    featured?: boolean;
    views?: number;
    likes?: number;
}

export interface BlogState {
    posts: BlogPost[];
    selectedPost: BlogPost | null;
    searchQuery: string;
    loading: boolean;
    error: string | null;
    filters: BlogFilters;
}

export interface BlogFilters {
    tags: string[];
    author: string | null;
    dateFrom: Date | null;
    dateTo: Date | null;
}

export const initialBlogState: BlogState = {
    posts: [],
    selectedPost: null,
    searchQuery: '',
    loading: false,
    error: null,
    filters: {
        tags: [],
        author: null,
        dateFrom: null,
        dateTo: null
    }
};
