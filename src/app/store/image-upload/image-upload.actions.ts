import { createAction, props } from '@ngrx/store';

export const uploadImage = createAction(
    '[Image Upload] Upload Image',
    props<{ file: File }>()
);

export const uploadImageSuccess = createAction(
    '[Image Upload] Upload Image Success',
    props<{ image: any }>()
);

export const uploadImageFailure = createAction(
    '[Image Upload] Upload Image Failure',
    props<{ error: string }>()
);

export const uploadMultipleImages = createAction(
    '[Image Upload] Upload Multiple Images',
    props<{ files: File[] }>()
);

export const uploadMultipleImagesSuccess = createAction(
    '[Image Upload] Upload Multiple Images Success',
    props<{ images: any[] }>()
);

export const loadImages = createAction('[Image Upload] Load Images');

export const loadImagesSuccess = createAction(
    '[Image Upload] Load Images Success',
    props<{ images: any[] }>()
);

export const loadImagesFailure = createAction(
    '[Image Upload] Load Images Failure',
    props<{ error: string }>()
);

export const deleteImage = createAction(
    '[Image Upload] Delete Image',
    props<{ id: number }>()
);

export const deleteImageSuccess = createAction(
    '[Image Upload] Delete Image Success',
    props<{ id: number }>()
);

