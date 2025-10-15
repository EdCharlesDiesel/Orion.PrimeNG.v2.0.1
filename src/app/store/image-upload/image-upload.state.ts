
export interface ImageUploadState {
    images: any[];
    loading: boolean;
    error: string | null;
    uploadedFiles: any[];
}

export const initialState: ImageUploadState = {
    images: [],
    loading: false,
    error: null,
    uploadedFiles: []
};
