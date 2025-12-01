export interface ImageData {
    uri: string;
    fileName: string;
    fileSize: number; // in bytes
    width: number;
    height: number;
    format: ImageFormat;
    timestamp: number;
}

export enum ImageFormat {
    JPEG = 'JPEG',
    PNG = 'PNG',
    WEBP = 'WEBP',
    GIF = 'GIF',
}

export interface ImageProcessingOptions {
    quality?: number; // 0-100
    width?: number;
    height?: number;
    format?: ImageFormat;
    rotation?: number; // 0, 90, 180, 270
    flipHorizontal?: boolean;
    flipVertical?: boolean;
}

export interface ImageProcessingResult {
    success: boolean;
    data?: ImageData;
    error?: string;
}
