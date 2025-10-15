// src/app/store/blog/blog.selectors.ts

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BlogState, BlogPost } from '../../core/models/blog.models';

// Feature selector
export const selectBlogState = createFeatureSelector<BlogState>('blog');

// Basic selectors
export const selectAllPosts = createSelector(
    selectBlogState,
    (state) => state.posts
);

export const selectSelectedPost = createSelector(
    selectBlogState,
    (state) => state.selectedPost
);

export const selectLoading = createSelector(
    selectBlogState,
    (state) => state.loading
);

export const selectError = createSelector(
    selectBlogState,
    (state) => state.error
);

export const selectSearchQuery = createSelector(
    selectBlogState,
    (state) => state.searchQuery
);

export const selectFilters = createSelector(
    selectBlogState,
    (state) => state.filters
);

// Featured post selector
export const selectFeaturedPost = createSelector(
    selectAllPosts,
    (posts) => posts.find(post => post.featured) || null
);

// Non-featured posts selector
export const selectNonFeaturedPosts = createSelector(
    selectAllPosts,
    (posts) => posts.filter(post => !post.featured)
);

// Filtered posts based on search query
export const selectFilteredPostsBySearch = createSelector(
    selectNonFeaturedPosts,
    selectSearchQuery,
    (posts, searchQuery) => {
        if (!searchQuery.trim()) {
            return posts;
        }

        const query = searchQuery.toLowerCase().trim();
        return posts.filter(post =>
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.author.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query)) ||
            post.content.toLowerCase().includes(query)
        );
    }
);

// Filtered posts based on filters
export const selectFilteredPosts = createSelector(
    selectFilteredPostsBySearch,
    selectFilters,
    (posts, filters) => {
        let filtered = posts;

        // Filter by tags
        if (filters.tags.length > 0) {
            filtered = filtered.filter(post =>
                filters.tags.some(tag => post.tags.includes(tag))
            );
        }

        // Filter by author
        if (filters.author) {
            filtered = filtered.filter(post =>
                post.author.toLowerCase().includes(filters.author!.toLowerCase())
            );
        }

        // Filter by date range
        if (filters.dateFrom) {
            filtered = filtered.filter(post =>
                new Date(post.date) >= filters.dateFrom!
            );
        }

        if (filters.dateTo) {
            filtered = filtered.filter(post =>
                new Date(post.date) <= filters.dateTo!
            );
        }

        return filtered;
    }
);

// Get all unique tags from all posts
export const selectAllTags = createSelector(
    selectAllPosts,
    (posts) => {
        const tags = posts.flatMap(post => post.tags);
        return [...new Set(tags)].sort();
    }
);

// Get all unique authors
export const selectAllAuthors = createSelector(
    selectAllPosts,
    (posts) => {
        const authors = posts.map(post => post.author);
        return [...new Set(authors)].sort();
    }
);

// Get post by ID
export const selectPostById = (id: string) => createSelector(
    selectAllPosts,
    (posts) => posts.find(post => post.id === id) || null
);

// Get recent posts (last 5)
export const selectRecentPosts = createSelector(
    selectAllPosts,
    (posts) => {
        return [...posts]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }
);

// Get popular posts (by views)
export const selectPopularPosts = createSelector(
    selectAllPosts,
    (posts) => {
        return [...posts]
            .filter(post => post.views !== undefined)
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);
    }
);

// Get posts by author
export const selectPostsByAuthor = (author: string) => createSelector(
    selectAllPosts,
    (posts) => posts.filter(post => post.author === author)
);

// Get posts by tag
export const selectPostsByTag = (tag: string) => createSelector(
    selectAllPosts,
    (posts) => posts.filter(post => post.tags.includes(tag))
);

// Check if there are active filters
export const selectHasActiveFilters = createSelector(
    selectFilters,
    selectSearchQuery,
    (filters, searchQuery) => {
        return (
            searchQuery.trim() !== '' ||
            filters.tags.length > 0 ||
            filters.author !== null ||
            filters.dateFrom !== null ||
            filters.dateTo !== null
        );
    }
);

// Get total posts count
export const selectTotalPostsCount = createSelector(
    selectAllPosts,
    (posts) => posts.length
);

// Get filtered posts count
export const selectFilteredPostsCount = createSelector(
    selectFilteredPosts,
    (posts) => posts.length
);
