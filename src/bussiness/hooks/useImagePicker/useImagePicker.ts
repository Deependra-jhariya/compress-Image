import { useState, useCallback } from 'react';
import { imagePickerService, ImagePickerResponse } from '../../../data/services/ImagePickerService';

export interface UseImagePickerResult {
    pickImage: (source: 'gallery' | 'camera') => Promise<void>;
    selectedImage: ImagePickerResponse | null;
    isLoading: boolean;
    error: string | null;
    clearImage: () => void;
    clearError: () => void;
}

/**
 * Custom hook for image selection from gallery or camera
 */
export const useImagePicker = (): UseImagePickerResult => {
    const [selectedImage, setSelectedImage] = useState<ImagePickerResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pickImage = useCallback(async (source: 'gallery' | 'camera') => {
        setIsLoading(true);
        setError(null);

        try {
            let result: ImagePickerResponse;

            if (source === 'gallery') {
                const hasPermission = await imagePickerService.requestGalleryPermission();
                if (!hasPermission) {
                    throw new Error('Gallery permission denied');
                }
                result = await imagePickerService.pickFromGallery({
                    mediaType: 'photo',
                    quality: 1,
                });
            } else {
                const hasPermission = await imagePickerService.requestCameraPermission();
                if (!hasPermission) {
                    throw new Error('Camera permission denied');
                }
                result = await imagePickerService.pickFromCamera({
                    mediaType: 'photo',
                    quality: 1,
                });
            }

            if (result.didCancel) {
                setError('Image selection cancelled');
                return;
            }

            if (result.errorCode || result.errorMessage) {
                throw new Error(result.errorMessage || 'Failed to pick image');
            }

            setSelectedImage(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to pick image';
            setError(errorMessage);
            console.error('Image picker error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearImage = useCallback(() => {
        setSelectedImage(null);
        setError(null);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        pickImage,
        selectedImage,
        isLoading,
        error,
        clearImage,
        clearError,
    };
};
