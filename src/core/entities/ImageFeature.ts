export interface ImageFeature {
    id: string;
    title: string;
    description: string;
    icon: string;
    route: string;
    color: string;
    gradient: string[];
}

export const ImageFeatureType = {
    COMPRESS: 'compress',
    RESIZE: 'resize',
    CROP: 'crop',
    CONVERT: 'convert',
    ROTATE: 'rotate',
    FLIP: 'flip',
    BLUR: 'blur',
    REMOVE_BACKGROUND: 'remove-background',
} as const;

export type ImageFeatureTypeKeys = typeof ImageFeatureType[keyof typeof ImageFeatureType];
