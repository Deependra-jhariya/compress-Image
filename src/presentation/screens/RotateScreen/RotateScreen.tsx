import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, Share } from 'react-native';
import { GradientBackground } from '../../components/atoms/GradientBackground';
import { Header } from '../../components/molecules/Header';
import { ImagePreview } from '../../components/molecules/ImagePreview';
import { ActionButtons } from '../../components/molecules/ActionButtons';
import { ProcessingOverlay } from '../../components/molecules/ProcessingOverlay';
import { colors, spacing, typography } from '../../../core/themes';
import { ImageData, ImageFormat } from '../../../core/entities/ImageData';
import { imagePickerService } from '../../../data/services/ImagePickerService';
import { imageRepository } from '../../../data/repositories/ImageRepositoryImpl';
import { useAppNavigation, useSaveImage, useImageProcessor } from '../../../bussiness/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';

const ROTATION_OPTIONS = [
    { label: '90°', value: 90, icon: '↻' },
    { label: '180°', value: 180, icon: '↷' },
    { label: '270°', value: 270, icon: '↺' },
];

const RotateScreen = () => {
    const { goback } = useAppNavigation();
    const { saveImage } = useSaveImage();
    const { isProcessing, processedImage, processImage, resetProcessor } = useImageProcessor();
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [rotation, setRotation] = useState<number>(0);

    const handlePickImage = useCallback(async () => {
        try {
            const result = await imagePickerService.pickFromGallery({
                mediaType: 'photo',
            });

            if (result.errorCode) {
                Alert.alert('Error', result.errorMessage || 'Failed to pick image');
                return;
            }

            if (result.didCancel) {
                return;
            }

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setSelectedImage({
                    uri: asset.uri,
                    fileName: asset.fileName || 'image.jpg',
                    fileSize: asset.fileSize || 0,
                    width: asset.width || 0,
                    height: asset.height || 0,
                    format: ImageFormat.JPEG,
                    timestamp: Date.now(),
                });
                resetProcessor();
                setRotation(0);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    }, [resetProcessor]);

    const handleRotate = useCallback(async () => {
        if (!selectedImage) return;

        await processImage(
            () => imageRepository.rotateImage(selectedImage.uri, rotation),
            'Image rotated successfully'
        );
    }, [selectedImage, rotation, processImage]);

    const handleSave = useCallback(async () => {
        if (!processedImage?.data) return;
        await saveImage(processedImage.data.uri, processedImage.data.fileName);
    }, [processedImage, saveImage]);

    const handleShare = useCallback(async () => {
        if (!processedImage?.data) return;
        try {
            await Share.share({
                url: processedImage.data.uri,
                title: 'Share Rotated Image',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share image');
        }
    }, [processedImage]);

    const updateRotation = (degrees: number) => {
        setRotation((prev) => (prev + degrees) % 360);
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Header title="Rotate Image" onBackPress={goback} />

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.previewContainer}>
                        <ImagePreview
                            imageUri={processedImage?.data?.uri || selectedImage?.uri}
                            imageData={processedImage?.data || selectedImage}
                            label={processedImage?.data ? "Rotated Result" : "Original Image"}
                            style={{ transform: [{ rotate: `${rotation} deg` }] }}
                        />
                    </View>

                    {selectedImage && (
                        <View style={styles.controlsContainer}>
                            <Text style={styles.label}>Rotate Clockwise:</Text>
                            <View style={styles.optionsRow}>
                                {ROTATION_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={styles.optionButton}
                                        onPress={() => updateRotation(option.value)}
                                    >
                                        <Text style={styles.optionIcon}>{option.icon}</Text>
                                        <Text style={styles.optionLabel}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.currentRotation}>
                                <Text style={styles.rotationText}>
                                    Current Rotation: {rotation}°
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setRotation(0)}
                                    style={styles.resetButton}
                                >
                                    <Text style={styles.resetText}>Reset</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <ActionButtons
                        onPickImage={handlePickImage}
                        onAction={handleRotate}
                        actionLabel="Apply Rotation"
                        isProcessing={isProcessing}
                        hasImage={!!selectedImage}
                        onSave={processedImage?.data ? handleSave : undefined}
                        onShare={processedImage?.data ? handleShare : undefined}
                    />
                </ScrollView>

                <ProcessingOverlay visible={isProcessing} message="Rotating image..." />
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    previewContainer: {
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    controlsContainer: {
        backgroundColor: colors.ui.card,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.ui.border,
        shadowColor: colors.brand.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
        marginBottom: 12,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    optionButton: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        backgroundColor: colors.background.tertiary,
        borderWidth: 1,
        borderColor: colors.ui.border,
        width: '30%',
    },
    optionIcon: {
        fontSize: 24,
        color: colors.text.primary,
        marginBottom: 4,
    },
    optionLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
    },
    currentRotation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.ui.border,
    },
    rotationText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
    },
    resetButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    resetText: {
        fontSize: typography.fontSize.xs,
        color: colors.brand.secondary,
        fontWeight: '600',
    },
});

export default RotateScreen;
