// src/app/store/blog/blog.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, mergeMap } from 'rxjs/operators';
import { BlogActions } from './blog.actions';
import { Router } from '@angular/router';
import { BlogService } from '../../service/blog-service';

@Injectable()
export class BlogEffects {

    // Load all posts
    loadPosts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BlogActions.loadPosts),
            switchMap(() =>
                this.blogService.getAllPosts().pipe(
                    map(posts => BlogActions.loadPostsSuccess({ posts })),
                    catchError(error => of(BlogActions.loadPostsFailure({
                        error: error.message || 'Failed to load posts'
                    })))
                )
            )
        )
    );

    // Load single post
    loadPost$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BlogActions.loadPost),
            switchMap(({ id }) =>
                this.blogService.getPostById(id).pipe(
                    map(post => BlogActions.loadPostSuccess({ post })),
                    catchError(error => of(BlogActions.loadPostFailure({
                        error: error.message || 'Failed to load post'
                    })))
                )
            )
        )
    );

    // Create post
    createPost$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BlogActions.createPost),
            switchMap(({ post }) =>
                this.blogService.createPost(post).pipe(
                    map(createdPost => BlogActions.createPostSuccess({ post: createdPost })),
                    catchError(error => of(BlogActions.createPostFailure({
                        error: error.message || 'Failed to create post'
                    })))
                )
            )
        )
    );

    // Navigate after successful post creation
    createPostSuccess$ = createEffect(() =>
            this.actions$.pipe(
                ofType(BlogActions.createPostSuccess),
                tap(({ post }) => {
                    this.router.navigate(['/blog', post.id]);
                })
            ),
        { dispatch: false }
    );

    // Update post
    updatePost$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BlogActions.updatePost),
            switchMap(({ id, changes }) =>
                this.blogService.updatePost(id, changes).pipe(
                    map(post => BlogActions.updatePostSuccess({ post })),
                    catchError(error => of(BlogActions.updatePostFailure({
                        error: error.message || 'Failed to update post'
                    })))
                )
            )
        )
    );

    // Delete post
    deletePost$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BlogActions.deletePost),
            switchMap(({ id }) =>
                this.blogService.deletePost(id).pipe(
                    map(() => BlogActions.deletePostSuccess({ id })),
                    catchError(error => of(BlogActions.deletePostFailure({
                        error: error.message || 'Failed to delete post'
                    })))
                )
            )
        )
    );

    // Navigate after successful post deletion
    deletePostSuccess$ = createEffect(() =>
            this.actions$.pipe(
                ofType(BlogActions.deletePostSuccess),
                tap(() => {
                    this.router.navigate(['/blog']);
                })
            ),
        { dispatch: false }
    );

    // Like post
    likePost$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BlogActions.likePost),
            mergeMap(({ id }) =>
                this.blogService.likePost(id).pipe(
                    map(likes => BlogActions.likePostSuccess({ id, likes })),
                    catchError(error => of(BlogActions.likePostFailure({
                        error: error.message || 'Failed to like post'
                    })))
                )
            )
        )
    );

    // Share post (analytics/tracking)
    sharePost$ = createEffect(() =>
            this.actions$.pipe(
                ofType(BlogActions.sharePost),
                tap(({ id }) => {
                    // Track share event (e.g., Google Analytics)
                    console.log(`Post ${id} shared`);
                    // You can add analytics tracking here
                })
            ),
        { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private blogService: BlogService,
        private router: Router
    ) {}
}
