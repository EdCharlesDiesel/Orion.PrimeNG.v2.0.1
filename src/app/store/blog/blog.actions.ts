// src/app/store/blog/blog.actions.ts

import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BlogPost, BlogFilters } from '../../core/models/blog.models';

export const BlogActions = createActionGroup({
    source: 'Blog',
    events: {
        // Load Posts
        'Load Posts': emptyProps(),
        'Load Posts Success': props<{ posts: BlogPost[] }>(),
        'Load Posts Failure': props<{ error: string }>(),

        // Load Single Post
        'Load Post': props<{ id: string }>(),
        'Load Post Success': props<{ post: BlogPost }>(),
        'Load Post Failure': props<{ error: string }>(),

        // Search
        'Set Search Query': props<{ query: string }>(),
        'Clear Search': emptyProps(),

        // Filters
        'Set Filters': props<{ filters: Partial<BlogFilters> }>(),
        'Clear Filters': emptyProps(),
        'Add Tag Filter': props<{ tag: string }>(),
        'Remove Tag Filter': props<{ tag: string }>(),

        // Create Post
        'Create Post': props<{ post: Omit<BlogPost, 'id'> }>(),
        'Create Post Success': props<{ post: BlogPost }>(),
        'Create Post Failure': props<{ error: string }>(),

        // Update Post
        'Update Post': props<{ id: string; changes: Partial<BlogPost> }>(),
        'Update Post Success': props<{ post: BlogPost }>(),
        'Update Post Failure': props<{ error: string }>(),

        // Delete Post
        'Delete Post': props<{ id: string }>(),
        'Delete Post Success': props<{ id: string }>(),
        'Delete Post Failure': props<{ error: string }>(),

        // Like Post
        'Like Post': props<{ id: string }>(),
        'Like Post Success': props<{ id: string; likes: number }>(),
        'Like Post Failure': props<{ error: string }>(),

        // Share Post
        'Share Post': props<{ id: string }>(),

        // Clear Selected Post
        'Clear Selected Post': emptyProps(),
    }
});
