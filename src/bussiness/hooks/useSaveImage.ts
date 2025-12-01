import { useState, useCallback } from 'react';
import { Alert, Platform, StatusBar } from 'react-native';
import { imageRepository } from '../../data/repositories/ImageRepositoryImpl';
import { imagePickerService } from '../../data/services/ImagePickerService';

export const useSaveImage = () => {
    const [isSaving, setIsSaving] = useState(false);

    const saveImage = useCallback(async (uri: string, fileName?: string) => {
        setIsSaving(true);
        if (Platform.OS === 'ios') {
            StatusBar.setNetworkActivityIndicatorVisible(true);
        }

        try {
            // Request permission first
            const hasPermission = await imagePickerService.requestGalleryPermission();
            if (!hasPermission) {
                Alert.alert('Permission Denied', 'Storage permission is required to save images.');
                return false;
            }

            const success = await imageRepository.saveImage(uri, fileName);

            if (success) {
                Alert.alert('Success', 'Image saved to gallery successfully!');
                return true;
            } else {
                Alert.alert('Error', 'Failed to save image to gallery.');
                return false;
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred while saving.');
            return false;
        } finally {
            setIsSaving(false);
            if (Platform.OS === 'ios') {
                StatusBar.setNetworkActivityIndicatorVisible(false);
            }
        }
    }, []);

    return {
        saveImage,
        isSaving
    };
};
