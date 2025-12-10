import { ImageFeature, ImageFeatureType } from '../entities/ImageFeature';

/**
 * Constants for image features displayed on home screen
 */
export const IMAGE_FEATURES: ImageFeature[] = [
    {
        id: ImageFeatureType.COMPRESS,
        title: 'Compress Image',
        description: 'Reduce file size while maintaining quality',
        icon: '🗜️',
        route: 'CompressScreen',
        color: '#6366f1',
        gradient: ['#6366f1', '#818cf8'],
    },
    {
        id: ImageFeatureType.RESIZE,
        title: 'Resize Image',
        description: 'Change dimensions in pixels or percentage',
        icon: '📐',
        route: 'ResizeScreen',
        color: '#06b6d4',
        gradient: ['#06b6d4', '#22d3ee'],
    },
    {
        id: ImageFeatureType.CROP,
        title: 'Crop Image',
        description: 'Crop to specific aspect ratios',
        icon: '✂️',
        route: 'CropScreen',
        color: '#8b5cf6',
        gradient: ['#8b5cf6', '#a78bfa'],
    },
    {
        id: ImageFeatureType.CONVERT,
        title: 'Convert Format',
        description: 'Convert between JPG, PNG, WEBP',
        icon: '🔄',
        route: 'ConvertScreen',
        color: '#10b981',
        gradient: ['#10b981', '#34d399'],
    },
    {
        id: ImageFeatureType.ROTATE,
        title: 'Rotate Image',
        description: 'Rotate 90°, 180°, or 270°',
        icon: '🔃',
        route: 'RotateScreen',
        color: '#f59e0b',
        gradient: ['#f59e0b', '#fbbf24'],
    },
    {
        id: ImageFeatureType.FLIP,
        title: 'Flip Image',
        description: 'Flip horizontally or vertically',
        icon: '↔️',
        route: 'FlipScreen',
        color: '#ec4899',
        gradient: ['#ec4899', '#f472b6'],
    },
    {
        id: ImageFeatureType.BLUR,
        title: 'Blur Image',
        description: 'Apply blur effect with adjustable intensity',
        icon: '🌫️',
        route: 'BlurScreen',
        color: '#6b7280',
        gradient: ['#6b7280', '#9ca3af'],
    },
    // {
    //     id: ImageFeatureType.REMOVE_BACKGROUND,
    //     title: 'Remove Background',
    //     description: 'Remove background with adjustable sensitivity',
    //     icon: '✨',
    //     route: 'RemoveBackgroundScreen',
    //     color: '#14b8a6',
    //     gradient: ['#14b8a6', '#2dd4bf'],
    // },
];
