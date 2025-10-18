import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import * as ImageUploadActions from './image-upload.actions';
import { ImageUploadService } from '../../service/image-upload.service';

@Injectable()
export class ImageUploadEffects {
    // uploadImage$ = createEffect(() =>
        // this.actions$.pipe(
        //     ofType(ImageUploadActions.uploadImage),
        //     switchMap(({ file }) =>
        //         this.imageUploadService.uploadImage(file).pipe(
        //             map((image) => ImageUploadActions.uploadImageSuccess({ image })),
        //             catchError((error) =>
        //                 of(ImageUploadActions.uploadImageFailure({ error: error.message }))
        //             )
        //         )
        //     )
        // )
    // );

    // uploadMultipleImages$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(ImageUploadActions.uploadMultipleImages),
    //         switchMap(({ files }) =>
    //             this.imageUploadService.uploadMultipleImages(files).pipe(
    //                 map((images) => ImageUploadActions.uploadMultipleImagesSuccess({ images })),
    //                 catchError((error) =>
    //                     of(ImageUploadActions.uploadImageFailure({ error: error.message }))
    //                 )
    //             )
    //         )
    //     )
    // );

    // loadImages$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(ImageUploadActions.loadImages),
    //         switchMap(() =>
    //             this.imageUploadService.getImages().pipe(
    //                 map((images) => ImageUploadActions.loadImagesSuccess({ images })),
    //                 catchError((error) =>
    //                     of(ImageUploadActions.loadImagesFailure({ error: error.message }))
    //                 )
    //             )
    //         )
    //     )
    // );
    //
    // deleteImage$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(ImageUploadActions.deleteImage),
    //         mergeMap(({ id }) =>
    //             this.imageUploadService.deleteImage(id).pipe(
    //                 map(() => ImageUploadActions.deleteImageSuccess({ id })),
    //                 catchError((error) =>
    //                     of(ImageUploadActions.uploadImageFailure({ error: error.message }))
    //                 )
    //             )
    //         )
    //     )
    // );

    constructor(
        private actions$: Actions,
        private imageUploadService: ImageUploadService
    ) {}
}
