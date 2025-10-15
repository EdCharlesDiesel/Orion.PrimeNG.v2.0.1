// src/app/store/blog/blog.reducer.ts

import { createReducer, on } from '@ngrx/store';
import { BlogActions } from './blog.actions';
import { BlogState, initialBlogState } from '../../core/models/blog.models';

export const blogReducer = createReducer(
    initialBlogState,

    // Load Posts
    on(BlogActions.loadPosts, (state): BlogState => ({
        ...state,
        loading: true,
        error: null
    })),
    on(BlogActions.loadPostsSuccess, (state, { posts }): BlogState => ({
        ...state,
        posts,
        loading: false,
        error: null
    })),
    on(BlogActions.loadPostsFailure, (state, { error }): BlogState => ({
        ...state,
        loading: false,
        error
    })),

    // Load Single Post
    on(BlogActions.loadPost, (state): BlogState => ({
        ...state,
        loading: true,
        error: null
    })),
    on(BlogActions.loadPostSuccess, (state, { post }): BlogState => ({
        ...state,
        selectedPost: post,
        loading: false,
        error: null
    })),
    on(BlogActions.loadPostFailure, (state, { error }): BlogState => ({
        ...state,
        loading: false,
        error
    })),

    // Search
    on(BlogActions.setSearchQuery, (state, { query }): BlogState => ({
        ...state,
        searchQuery: query
    })),
    on(BlogActions.clearSearch, (state): BlogState => ({
        ...state,
        searchQuery: ''
    })),

    // Filters
    on(BlogActions.setFilters, (state, { filters }): BlogState => ({
        ...state,
        filters: { ...state.filters, ...filters }
    })),
    on(BlogActions.clearFilters, (state): BlogState => ({
        ...state,
        filters: initialBlogState.filters
    })),
    on(BlogActions.addTagFilter, (state, { tag }): BlogState => ({
        ...state,
        filters: {
            ...state.filters,
            tags: [...state.filters.tags, tag]
        }
    })),
    on(BlogActions.removeTagFilter, (state, { tag }): BlogState => ({
        ...state,
        filters: {
            ...state.filters,
            tags: state.filters.tags.filter(t => t !== tag)
        }
    })),

    // Create Post
    on(BlogActions.createPost, (state): BlogState => ({
        ...state,
        loading: true,
        error: null
    })),
    on(BlogActions.createPostSuccess, (state, { post }): BlogState => ({
        ...state,
        posts: [...state.posts, post],
        loading: false,
        error: null
    })),
    on(BlogActions.createPostFailure, (state, { error }): BlogState => ({
        ...state,
        loading: false,
        error
    })),

    // Update Post
    on(BlogActions.updatePost, (state): BlogState => ({
        ...state,
        loading: true,
        error: null
    })),
    on(BlogActions.updatePostSuccess, (state, { post }): BlogState => ({
        ...state,
        posts: state.posts.map(p => p.id === post.id ? post : p),
        selectedPost: state.selectedPost?.id === post.id ? post : state.selectedPost,
        loading: false,
        error: null
    })),
    on(BlogActions.updatePostFailure, (state, { error }): BlogState => ({
        ...state,
        loading: false,
        error
    })),

    // Delete Post
    on(BlogActions.deletePost, (state): BlogState => ({
        ...state,
        loading: true,
        error: null
    })),
    on(BlogActions.deletePostSuccess, (state, { id }): BlogState => ({
        ...state,
        posts: state.posts.filter(p => p.id !== id),
        selectedPost: state.selectedPost?.id === id ? null : state.selectedPost,
        loading: false,
        error: null
    })),
    on(BlogActions.deletePostFailure, (state, { error }): BlogState => ({
        ...state,
        loading: false,
        error
    })),

    // Like Post
    on(BlogActions.likePostSuccess, (state, { id, likes }): BlogState => ({
        ...state,
        posts: state.posts.map(p =>
            p.id === id ? { ...p, likes } : p
        ),
        selectedPost: state.selectedPost?.id === id
            ? { ...state.selectedPost, likes }
            : state.selectedPost
    })),

    // Clear Selected Post
    on(BlogActions.clearSelectedPost, (state): BlogState => ({
        ...state,
        selectedPost: null
    }))
);
