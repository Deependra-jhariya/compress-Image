import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { ImageProcessingResult } from '../../core/entities/ImageData';

interface UseImageProcessorResult {
    isProcessing: boolean;
    processedImage: ImageProcessingResult | null;
    error: string | null;
    processImage: <T>(
        processingFn: () => Promise<ImageProcessingResult>,
        successMessage?: string
    ) => Promise<ImageProcessingResult | null>;
    resetProcessor: () => void;
}

export const useImageProcessor = (): UseImageProcessorResult => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedImage, setProcessedImage] = useState<ImageProcessingResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const processImage = useCallback(async (
        processingFn: () => Promise<ImageProcessingResult>,
        successMessage?: string
    ): Promise<ImageProcessingResult | null> => {
        setIsProcessing(true);
        setError(null);
        setProcessedImage(null);

        try {
            const result = await processingFn();

            if (result.success && result.data) {
                setProcessedImage(result);
                if (successMessage) {
                    // Optional: Show toast or simple alert, but maybe better to let UI decide
                    // Alert.alert('Success', successMessage);
                }
                return result;
            } else {
                const errorMessage = result.error || 'Image processing failed';
                setError(errorMessage);
                Alert.alert('Error', errorMessage);
                return null;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            return null;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const resetProcessor = useCallback(() => {
        setProcessedImage(null);
        setError(null);
        setIsProcessing(false);
    }, []);

    return {
        isProcessing,
        processedImage,
        error,
        processImage,
        resetProcessor,
    };
};
