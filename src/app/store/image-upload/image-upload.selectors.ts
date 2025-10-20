import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ImageUploadState } from './image-upload.state';

export const selectImageUploadState = createFeatureSelector<ImageUploadState>('imageUpload');

export const selectAllImages = createSelector(
    selectImageUploadState,
    (state) => state.images
);

export const selectUploadedFiles = createSelector(
    selectImageUploadState,
    (state) => state.uploadedFiles
);

export const selectLoading = createSelector(
    selectImageUploadState,
    (state) => state.loading
);

export const selectError = createSelector(
    selectImageUploadState,
    (state) => state.error
);
