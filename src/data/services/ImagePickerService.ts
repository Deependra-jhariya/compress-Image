import { launchCamera, launchImageLibrary, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';

export interface ImagePickerOptions {
    mediaType: 'photo' | 'video' | 'mixed';
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    includeBase64?: boolean;
}

export interface ImagePickerResponse {
    didCancel?: boolean;
    errorCode?: string;
    errorMessage?: string;
    assets?: Array<{
        uri: string;
        fileName?: string;
        fileSize?: number;
        width?: number;
        height?: number;
        type?: string;
    }>;
}

/**
 * Service for picking images from gallery or camera
 */
export class ImagePickerService {
    async pickFromGallery(options?: ImagePickerOptions): Promise<ImagePickerResponse> {
        try {
            const hasPermission = await this.requestGalleryPermission();
            if (!hasPermission) {
                return {
                    errorCode: 'PERMISSION_DENIED',
                    errorMessage: 'Gallery permission denied',
                };
            }

            const pickerOptions: ImageLibraryOptions = {
                mediaType: options?.mediaType || 'photo',
                quality: (options?.quality || 1) as any,
                selectionLimit: 1,
                includeBase64: options?.includeBase64 ?? false,
            };

            if (options?.maxWidth) pickerOptions.maxWidth = options.maxWidth;
            if (options?.maxHeight) pickerOptions.maxHeight = options.maxHeight;

            const result = await launchImageLibrary(pickerOptions);

            if (result.didCancel) {
                return { didCancel: true };
            }

            if (result.errorCode) {
                return {
                    errorCode: result.errorCode,
                    errorMessage: result.errorMessage,
                };
            }

            return {
                assets: result.assets?.map(asset => ({
                    uri: asset.uri || '',
                    fileName: asset.fileName,
                    fileSize: asset.fileSize,
                    width: asset.width,
                    height: asset.height,
                    type: asset.type,
                })),
            };
        } catch (error) {
            return {
                errorCode: 'PICKER_ERROR',
                errorMessage: error instanceof Error ? error.message : 'Failed to pick image',
            };
        }
    }

    async pickFromCamera(options?: ImagePickerOptions): Promise<ImagePickerResponse> {
        try {
            const hasPermission = await this.requestCameraPermission();
            if (!hasPermission) {
                return {
                    errorCode: 'PERMISSION_DENIED',
                    errorMessage: 'Camera permission denied',
                };
            }

            const cameraOptions: CameraOptions = {
                mediaType: options?.mediaType || 'photo',
                quality: (options?.quality || 1) as any,
                saveToPhotos: false,
                includeBase64: options?.includeBase64 ?? false,
            };

            if (options?.maxWidth) cameraOptions.maxWidth = options.maxWidth;
            if (options?.maxHeight) cameraOptions.maxHeight = options.maxHeight;

            const result = await launchCamera(cameraOptions);

            if (result.didCancel) {
                return { didCancel: true };
            }

            if (result.errorCode) {
                return {
                    errorCode: result.errorCode,
                    errorMessage: result.errorMessage,
                };
            }

            return {
                assets: result.assets?.map(asset => ({
                    uri: asset.uri || '',
                    fileName: asset.fileName,
                    fileSize: asset.fileSize,
                    width: asset.width,
                    height: asset.height,
                    type: asset.type,
                })),
            };
        } catch (error) {
            return {
                errorCode: 'CAMERA_ERROR',
                errorMessage: error instanceof Error ? error.message : 'Failed to capture image',
            };
        }
    }

    async requestCameraPermission(): Promise<boolean> {
        if (Platform.OS === 'ios') {
            return true; // Handled by Info.plist and OS automatically
        }

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'App needs access to your camera to take photos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    }

    async requestGalleryPermission(): Promise<boolean> {
        if (Platform.OS === 'ios') {
            return true; // Handled by Info.plist and OS automatically
        }

        if (Number(Platform.Version) >= 33) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    {
                        title: 'Gallery Permission',
                        message: 'App needs access to your photos.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message: 'App needs access to your storage to pick photos.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
    }
}

// Singleton instance
export const imagePickerService = new ImagePickerService();
