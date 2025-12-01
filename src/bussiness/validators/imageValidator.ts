import { ImageFormat } from '../../../core/entities/ImageData';

export const imageValidator = {
    /**
     * Validate if file is a supported image format
     */
    isValidImageFormat(fileName: string): boolean {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        return extension ? supportedFormats.includes(extension) : false;
    },

    /**
     * Validate if file size is within acceptable range
     */
    isValidFileSize(fileSize: number, maxSizeMB: number = 50): boolean {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return fileSize > 0 && fileSize <= maxSizeBytes;
    },

    /**
     * Validate if image dimensions are within acceptable range
     */
    isValidDimensions(
        width: number,
        height: number,
        maxWidth: number = 10000,
        maxHeight: number = 10000
    ): boolean {
        return width > 0 && height > 0 && width <= maxWidth && height <= maxHeight;
    },

    /**
     * Validate quality value (0-100)
     */
    isValidQuality(quality: number): boolean {
        return quality >= 0 && quality <= 100;
    },

    /**
     * Validate rotation degrees
     */
    isValidRotation(degrees: number): boolean {
        return [0, 90, 180, 270].includes(degrees);
    },

    /**
     * Get image format from file extension
     */
    getImageFormat(fileName: string): ImageFormat | null {
        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'jpg':
            case 'jpeg':
                return ImageFormat.JPEG;
            case 'png':
                return ImageFormat.PNG;
            case 'webp':
                return ImageFormat.WEBP;
            case 'gif':
                return ImageFormat.GIF;
            default:
                return null;
        }
    },

    /**
     * Format file size to human readable string
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Calculate compression ratio
     */
    calculateCompressionRatio(originalSize: number, compressedSize: number): number {
        if (originalSize === 0) return 0;
        return Math.round(((originalSize - compressedSize) / originalSize) * 100);
    },
};
