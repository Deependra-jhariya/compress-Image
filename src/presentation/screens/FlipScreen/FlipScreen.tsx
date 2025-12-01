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

const FlipScreen = () => {
    const { goback } = useAppNavigation();
    const { saveImage } = useSaveImage();
    const { isProcessing, processedImage, processImage, resetProcessor } = useImageProcessor();
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
    const [flipVertical, setFlipVertical] = useState<boolean>(false);

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
                setFlipHorizontal(false);
                setFlipVertical(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    }, [resetProcessor]);

    const handleFlip = useCallback(async () => {
        if (!selectedImage) return;

        await processImage(
            () => imageRepository.flipImage(selectedImage.uri, flipHorizontal, flipVertical),
            'Image flipped successfully'
        );
    }, [selectedImage, flipHorizontal, flipVertical, processImage]);

    const handleSave = useCallback(async () => {
        if (!processedImage?.data) return;
        await saveImage(processedImage.data.uri, processedImage.data.fileName);
    }, [processedImage, saveImage]);

    const handleShare = useCallback(async () => {
        if (!processedImage?.data) return;
        try {
            await Share.share({
                url: processedImage.data.uri,
                title: 'Share Flipped Image',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share image');
        }
    }, [processedImage]);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Header title="Flip Image" onBackPress={goback} />

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.previewContainer}>
                        <ImagePreview
                            imageUri={processedImage?.data?.uri || selectedImage?.uri}
                            imageData={processedImage?.data || selectedImage}
                            label={processedImage?.data ? "Flipped Result" : "Original Image"}
                            style={{
                                transform: [
                                    { scaleX: flipHorizontal ? -1 : 1 },
                                    { scaleY: flipVertical ? -1 : 1 }
                                ]
                            }}
                        />
                    </View>

                    {selectedImage && (
                        <View style={styles.controlsContainer}>
                            <Text style={styles.label}>Flip Direction:</Text>
                            <View style={styles.optionsRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.optionButton,
                                        flipHorizontal && styles.optionButtonActive
                                    ]}
                                    onPress={() => setFlipHorizontal(!flipHorizontal)}
                                >
                                    <Text style={[
                                        styles.optionIcon,
                                        flipHorizontal && styles.optionIconActive
                                    ]}>↔️</Text>
                                    <Text style={[
                                        styles.optionLabel,
                                        flipHorizontal && styles.optionLabelActive
                                    ]}>Horizontal</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.optionButton,
                                        flipVertical && styles.optionButtonActive
                                    ]}
                                    onPress={() => setFlipVertical(!flipVertical)}
                                >
                                    <Text style={[
                                        styles.optionIcon,
                                        flipVertical && styles.optionIconActive
                                    ]}>↕️</Text>
                                    <Text style={[
                                        styles.optionLabel,
                                        flipVertical && styles.optionLabelActive
                                    ]}>Vertical</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.resetContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setFlipHorizontal(false);
                                        setFlipVertical(false);
                                    }}
                                    style={styles.resetButton}
                                >
                                    <Text style={styles.resetText}>Reset</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <ActionButtons
                        onPickImage={handlePickImage}
                        onAction={handleFlip}
                        actionLabel="Apply Flip"
                        isProcessing={isProcessing}
                        hasImage={!!selectedImage}
                        onSave={processedImage?.data ? handleSave : undefined}
                        onShare={processedImage?.data ? handleShare : undefined}
                    />
                </ScrollView>

                <ProcessingOverlay visible={isProcessing} message="Flipping image..." />
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
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    optionButton: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        backgroundColor: colors.background.tertiary,
        borderWidth: 1,
        borderColor: colors.ui.border,
        width: '45%',
    },
    optionButtonActive: {
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primary,
    },
    optionIcon: {
        fontSize: 24,
        color: colors.text.secondary,
        marginBottom: 8,
    },
    optionIconActive: {
        color: colors.text.inverse,
    },
    optionLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
    },
    optionLabelActive: {
        color: colors.text.inverse,
        fontWeight: '600',
    },
    resetContainer: {
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.ui.border,
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

export default FlipScreen;
