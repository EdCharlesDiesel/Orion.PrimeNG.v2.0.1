import { createReducer, on } from '@ngrx/store';
import * as ImageUploadActions from './image-upload.actions';
import { initialState } from './image-upload.state';

export const ImageUploadReducer = createReducer(
    initialState,
    on(ImageUploadActions.uploadImage, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ImageUploadActions.uploadImageSuccess, (state, { image }) => ({
        ...state,
        loading: false,
        uploadedFiles: [...state.uploadedFiles, image],
        images: [...state.images, image]
    })),
    on(ImageUploadActions.uploadImageFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(ImageUploadActions.uploadMultipleImages, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ImageUploadActions.uploadMultipleImagesSuccess, (state, { images }) => ({
        ...state,
        loading: false,
        uploadedFiles: [...state.uploadedFiles, ...images],
        images: [...state.images, ...images]
    })),
    on(ImageUploadActions.loadImages, (state) => ({
        ...state,
        loading: true
    })),
    on(ImageUploadActions.loadImagesSuccess, (state, { images }) => ({
        ...state,
        loading: false,
        images
    })),
    on(ImageUploadActions.loadImagesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(ImageUploadActions.deleteImageSuccess, (state, { id }) => ({
        ...state,
        images: state.images.filter(img => img.id !== id),
        uploadedFiles: state.uploadedFiles.filter(img => img.id !== id)
    }))
);
