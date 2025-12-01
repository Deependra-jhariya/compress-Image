import ImageEditor from '@react-native-community/image-editor';
import ImageResizer from 'react-native-image-resizer';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { removeBackground } from '@jacobjmc/react-native-background-remover';
import { IImageRepository } from './IImageRepository';
import { ImageData, ImageFormat, ImageProcessingResult, ImageProcessingOptions } from '../../core/entities/ImageData';

export class ImageRepositoryImpl implements IImageRepository {
    async compressImage(imageUri: string, quality: number): Promise<ImageProcessingResult> {
        try {
            // Quality is 0-100 for ImageResizer
            // We use a large dimension to avoid downscaling unless necessary, or we could fetch dimensions first.
            // For compression, we usually want to keep dimensions but lower quality.
            // ImageResizer requires width/height.
            const result = await ImageResizer.createResizedImage(
                imageUri,
                4000, // Max width (safe high value)
                4000, // Max height
                'JPEG',
                Math.max(0, Math.min(100, quality * 100)), // Convert 0-1 to 0-100
                0, // rotation
                undefined, // outputPath
                false, // keepMeta
                { mode: 'contain', onlyScaleDown: true } // options
            );

            return {
                success: true,
                data: {
                    uri: result.uri,
                    fileName: result.name,
                    fileSize: result.size,
                    width: result.width,
                    height: result.height,
                    format: ImageFormat.JPEG,
                    timestamp: Date.now(),
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to compress image',
            };
        }
    }

    async compressImageToSize(imageUri: string, targetSizeKB: number): Promise<ImageProcessingResult> {
        try {
            let quality = 100;
            let minQuality = 5;
            let result;
            let attempts = 0;
            const maxAttempts = 10; // Prevent infinite loops

            // Initial compression
            result = await ImageResizer.createResizedImage(
                imageUri,
                4000, 4000, 'JPEG', quality, 0, undefined, false, { mode: 'contain', onlyScaleDown: true }
            );

            // Iteratively reduce quality until size is met
            while (result.size > targetSizeKB * 1024 && quality > minQuality && attempts < maxAttempts) {
                // Heuristic: Reduce quality proportional to size difference, but at least by 5
                const ratio = (targetSizeKB * 1024) / result.size;
                const step = Math.max(5, Math.floor((1 - ratio) * 20));
                quality = Math.max(minQuality, quality - step);

                attempts++;
                result = await ImageResizer.createResizedImage(
                    imageUri,
                    4000, 4000, 'JPEG', quality, 0, undefined, false, { mode: 'contain', onlyScaleDown: true }
                );
            }

            return {
                success: true,
                data: {
                    uri: result.uri,
                    fileName: result.name,
                    fileSize: result.size,
                    width: result.width,
                    height: result.height,
                    format: ImageFormat.JPEG,
                    timestamp: Date.now(),
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to compress to target size',
            };
        }
    }

    async resizeImage(imageUri: string, width: number, height: number): Promise<ImageProcessingResult> {
        try {
            const result = await ImageResizer.createResizedImage(
                imageUri,
                width,
                height,
                'JPEG',
                100, // quality
                0, // rotation
                undefined,
                false,
                { mode: 'stretch' } // Force exact dimensions
            );

            return {
                success: true,
                data: {
                    uri: result.uri,
                    fileName: result.name,
                    fileSize: result.size,
                    width: result.width,
                    height: result.height,
                    format: ImageFormat.JPEG,
                    timestamp: Date.now(),
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to resize image',
            };
        }
    }

    async cropImage(imageUri: string, cropData: { x: number; y: number; width: number; height: number }): Promise<ImageProcessingResult> {
        try {
            const cropResult = await ImageEditor.cropImage(imageUri, {
                offset: { x: cropData.x, y: cropData.y },
                size: { width: cropData.width, height: cropData.height },
                // displaySize: { width: cropData.width, height: cropData.height }, // Optional, can resize
            });

            // ImageEditor returns an object with uri (and potentially width/height)
            return {
                success: true,
                data: {
                    uri: cropResult.uri,
                    fileName: 'cropped_image.jpg',
                    fileSize: 0, // Unknown without stat
                    width: cropResult.width || cropData.width,
                    height: cropResult.height || cropData.height,
                    format: ImageFormat.JPEG,
                    timestamp: Date.now(),
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to crop image',
            };
        }
    }

    async convertFormat(imageUri: string, targetFormat: ImageFormat): Promise<ImageProcessingResult> {
        try {
            const compressFormat = targetFormat === ImageFormat.PNG ? 'PNG' : targetFormat === ImageFormat.WEBP ? 'WEBP' : 'JPEG';

            const result = await ImageResizer.createResizedImage(
                imageUri,
                4000, // Max dimensions
                4000,
                compressFormat,
                100,
                0
            );

            return {
                success: true,
                data: {
                    uri: result.uri,
                    fileName: result.name,
                    fileSize: result.size,
                    width: result.width,
                    height: result.height,
                    format: targetFormat,
                    timestamp: Date.now(),
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to convert image',
            };
        }
    }

    async rotateImage(imageUri: string, degrees: number): Promise<ImageProcessingResult> {
        try {
            const result = await ImageResizer.createResizedImage(
                imageUri,
                4000,
                4000,
                'JPEG',
                100,
                degrees,
                undefined,
                true // keepMeta
            );

            return {
                success: true,
                data: {
                    uri: result.uri,
                    fileName: result.name,
                    fileSize: result.size,
                    width: result.width,
                    height: result.height,
                    format: ImageFormat.JPEG,
                    timestamp: Date.now(),
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to rotate image',
            };
        }
    }

    async flipImage(imageUri: string, horizontal: boolean, vertical: boolean): Promise<ImageProcessingResult> {
        try {
            // Current libraries (ImageResizer, ImageEditor) do not support direct flipping (mirroring).
            // We would need 'react-native-image-manipulator' or similar.
            // For now, we return an error to indicate it's not supported yet, rather than a fake success.
            return {
                success: false,
                error: 'Flip functionality requires additional native library (e.g. expo-image-manipulator)',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to flip image',
            };
        }
    }

    async blurImage(imageUri: string, blurRadius: number): Promise<ImageProcessingResult> {
        try {
            // Blur effect using downscale-upscale technique
            // The more we downscale, the more blur effect we get
            const blurFactor = Math.max(0.1, Math.min(1, 1 - (blurRadius / 100)));

            // Get original dimensions first
            const stat = await RNFS.stat(imageUri);

            // Downscale
            const downscaled = await ImageResizer.createResizedImage(
                imageUri,
                800 * blurFactor,
                800 * blurFactor,
                'JPEG',
                80,
                0,
                undefined,
                false,
                { mode: 'contain', onlyScaleDown: false }
            );

            // Upscale back to create blur effect
            const result = await ImageResizer.createResizedImage(
                downscaled.uri,
                800,
                800,
                'JPEG',
                90,
                0,
                undefined,
                false,
                { mode: 'contain', onlyScaleDown: false }
            );

            return {
                success: true,
                data: {
                    uri: result.uri,
                    fileName: result.name,
                    fileSize: result.size,
                    width: result.width,
                    height: result.height,
                    format: ImageFormat.JPEG,
                    timestamp: Date.now(),
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to blur image',
            };
        }
    }

    async removeBackground(imageUri: string, sensitivity: number): Promise<ImageProcessingResult> {
        try {
            // Use native background remover (MLKit on Android, Vision on iOS)
            // Note: sensitivity parameter is not used by the native library
            // The library uses optimized ML models for automatic background detection

            const result = await BackgroundRemover.removeBackground(imageUri);

            // Get file info for the processed image
            const stat = await RNFS.stat(result);

            return {
                success: true,
                data: {
                    uri: result,
                    fileName: 'removed_bg.png',
                    fileSize: typeof stat.size === 'string' ? parseInt(stat.size) : stat.size,
                    width: 0, // Library doesn't provide dimensions
                    height: 0,
                    format: ImageFormat.PNG,
                    timestamp: Date.now(),
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to remove background. Make sure you have iOS 15+ or Android with MLKit support.',
            };
        }
    }

    async watermarkImage(
        imageUri: string,
        watermarkText: string,
        position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center'
    ): Promise<ImageProcessingResult> {
        try {
            // Note: This is a placeholder implementation
            // For proper watermarking, we would need a library like react-native-canvas
            // or a native module that supports text overlay
            // For now, we'll return an error indicating this needs additional setup
            return {
                success: false,
                error: 'Watermark functionality requires additional setup. Please use a third-party service or install react-native-canvas.',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to add watermark',
            };
        }
    }

    async processImage(imageUri: string, options: ImageProcessingOptions): Promise<ImageProcessingResult> {
        // Generic processing method - for now, just compress as a placeholder
        // A full implementation would chain multiple operations based on options
        console.log(`Processing image: ${imageUri} with options:`, options);
        return this.compressImage(imageUri, options.quality || 0.8);
    }

    async getImageInfo(imageUri: string): Promise<ImageData | null> {
        try {
            const stat = await RNFS.stat(imageUri);

            return {
                uri: 'file://' + stat.path,
                fileName: imageUri.split('/').pop() || 'image.jpg',
                fileSize: typeof stat.size === 'string' ? parseInt(stat.size) : stat.size,
                width: 0, // RNFS stat doesn't provide dimensions, would need Image.getSize
                height: 0,
                format: ImageFormat.JPEG, // Defaulting to JPEG as we can't easily determine without extension parsing
                timestamp: stat.mtime ? new Date(stat.mtime).getTime() : Date.now(),
            };
        } catch (error) {
            console.error('Failed to get image info:', error);
            return null;
        }
    }

    async saveImage(imageUri: string, fileName?: string): Promise<boolean> {
        try {
            // Save to Camera Roll (Gallery)
            // Note: fileName is not directly used by CameraRoll on Android/iOS in the same way as file system
            // but we keep it in the signature for compatibility
            await CameraRoll.saveAsset(imageUri, { type: 'photo', album: 'CompressImage' });
            return true;
        } catch (error) {
            console.error('Failed to save image:', error);
            return false;
        }
    }

    async deleteImage(imageUri: string): Promise<boolean> {
        try {
            if (await RNFS.exists(imageUri)) {
                await RNFS.unlink(imageUri);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to delete image:', error);
            return false;
        }
    }
}

// Singleton instance
export const imageRepository = new ImageRepositoryImpl();
