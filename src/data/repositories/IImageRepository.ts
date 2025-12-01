import { ImageData, ImageProcessingOptions, ImageProcessingResult } from '../../core/entities/ImageData';

/**
 * Repository interface for image operations
 * This follows the Repository pattern for clean architecture
 */
export interface IImageRepository {
    /**
     * Compress an image with specified quality
     */
    compressImage(imageUri: string, quality: number): Promise<ImageProcessingResult>;

    /**
     * Compress an image to a specific target size in KB
     */
    compressImageToSize(imageUri: string, targetSizeKB: number): Promise<ImageProcessingResult>;

    /**
     * Resize an image to specified dimensions
     */
    resizeImage(imageUri: string, width: number, height: number): Promise<ImageProcessingResult>;

    /**
     * Crop an image to specified dimensions
     */
    cropImage(imageUri: string, cropData: { x: number; y: number; width: number; height: number }): Promise<ImageProcessingResult>;

    /**
     * Convert image to different format
     */
    convertFormat(imageUri: string, targetFormat: string): Promise<ImageProcessingResult>;

    /**
     * Rotate image by specified degrees
     */
    rotateImage(imageUri: string, degrees: number): Promise<ImageProcessingResult>;

    /**
     * Flip image horizontally or vertically
     */
    flipImage(imageUri: string, horizontal: boolean, vertical: boolean): Promise<ImageProcessingResult>;

    /**
     * Apply blur effect to image
     */
    blurImage(imageUri: string, blurRadius: number): Promise<ImageProcessingResult>;

    /**
     * Remove background from image
     */
    removeBackground(imageUri: string, sensitivity: number): Promise<ImageProcessingResult>;

    /**
     * Add watermark to image
     */
    watermarkImage(imageUri: string, watermarkText: string, position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center'): Promise<ImageProcessingResult>;

    /**
     * Process image with multiple options
     */
    processImage(imageUri: string, options: ImageProcessingOptions): Promise<ImageProcessingResult>;

    /**
     * Get image metadata
     */
    getImageInfo(imageUri: string): Promise<ImageData | null>;

    /**
     * Save processed image to device
     */
    saveImage(imageUri: string, fileName?: string): Promise<boolean>;

    /**
     * Delete image from device
     */
    deleteImage(imageUri: string): Promise<boolean>;
}
