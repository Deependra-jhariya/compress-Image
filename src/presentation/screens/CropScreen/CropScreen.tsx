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


const ASPECT_RATIOS = [
    { label: 'Free', value: null },
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4 / 3 },
    { label: '3:4', value: 3 / 4 },
    { label: '16:9', value: 16 / 9 },
];

const CropScreen = () => {
    const { goback } = useAppNavigation();
    const { saveImage } = useSaveImage();
    const { isProcessing, processedImage, processImage, resetProcessor } = useImageProcessor();
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [selectedRatio, setSelectedRatio] = useState<number | null>(null);

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
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    }, [resetProcessor]);

    const handleCrop = useCallback(async () => {
        if (!selectedImage) return;

        // Calculate dummy crop dimensions based on ratio
        // In real implementation, this would come from a crop UI library
        let width = selectedImage.width;
        let height = selectedImage.height;

        if (selectedRatio) {
            if (width / height > selectedRatio) {
                width = height * selectedRatio;
            } else {
                height = width / selectedRatio;
            }
        } else {
            // Free crop simulation (just reduce by 10%)
            width = width * 0.9;
            height = height * 0.9;
        }

        await processImage(
            () => imageRepository.cropImage(selectedImage.uri, {
                x: 0,
                y: 0,
                width: Math.round(width),
                height: Math.round(height),
            }),
            'Image cropped successfully'
        );
    }, [selectedImage, selectedRatio, processImage]);

    const handleSave = useCallback(async () => {
        if (!processedImage?.data) return;
        await saveImage(processedImage.data.uri, processedImage.data.fileName);
    }, [processedImage, saveImage]);

    const handleShare = useCallback(async () => {
        if (!processedImage?.data) return;
        try {
            await Share.share({
                url: processedImage.data.uri,
                title: 'Share Cropped Image',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share image');
        }
    }, [processedImage]);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Header title="Crop Image" onBackPress={goback} />

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.previewContainer}>
                        <ImagePreview
                            imageUri={processedImage?.data?.uri || selectedImage?.uri}
                            imageData={processedImage?.data || selectedImage}
                            label={processedImage?.data ? "Cropped Result" : "Original Image"}
                        />
                    </View>

                    {selectedImage && (
                        <View style={styles.controlsContainer}>
                            <Text style={styles.label}>Aspect Ratio:</Text>
                            <View style={styles.ratioGrid}>
                                {ASPECT_RATIOS.map((ratio) => (
                                    <TouchableOpacity
                                        key={ratio.label}
                                        style={[
                                            styles.ratioButton,
                                            selectedRatio === ratio.value && styles.ratioButtonActive
                                        ]}
                                        onPress={() => setSelectedRatio(ratio.value)}
                                    >
                                        <Text style={[
                                            styles.ratioText,
                                            selectedRatio === ratio.value && styles.ratioTextActive
                                        ]}>
                                            {ratio.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={styles.hint}>
                                Select an aspect ratio to crop
                            </Text>
                        </View>
                    )}

                    <ActionButtons
                        onPickImage={handlePickImage}
                        onAction={handleCrop}
                        actionLabel="Crop Image"
                        isProcessing={isProcessing}
                        hasImage={!!selectedImage}
                        onSave={processedImage?.data ? handleSave : undefined}
                        onShare={processedImage?.data ? handleShare : undefined}
                    />
                </ScrollView>

                <ProcessingOverlay visible={isProcessing} message="Cropping image..." />
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
    ratioGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    ratioButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: colors.background.tertiary,
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    ratioButtonActive: {
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primary,
    },
    ratioText: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
    },
    ratioTextActive: {
        color: colors.text.inverse,
        fontWeight: '600',
    },
    hint: {
        fontSize: typography.fontSize.xs,
        color: colors.text.disabled,
        textAlign: 'center',
    },
});

export default CropScreen;
