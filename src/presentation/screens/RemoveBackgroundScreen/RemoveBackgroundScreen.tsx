import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, Share } from 'react-native';
import Slider from '@react-native-community/slider';
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

const RemoveBackgroundScreen = () => {
    const { goback } = useAppNavigation();
    const { isSaving, saveImage } = useSaveImage();
    const { isProcessing, processedImage, processImage, resetProcessor } = useImageProcessor();
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [sensitivity, setSensitivity] = useState<number>(50);

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

    const handleRemoveBackground = useCallback(async () => {
        if (!selectedImage) return;

        await processImage(
            () => imageRepository.removeBackground(selectedImage.uri, sensitivity),
            'Background removed successfully'
        );
    }, [selectedImage, sensitivity, processImage]);

    const handleSave = useCallback(async () => {
        if (!processedImage?.data) return;
        await saveImage(processedImage.data.uri, processedImage.data.fileName);
    }, [processedImage, saveImage]);

    const handleShare = useCallback(async () => {
        if (!processedImage?.data) return;
        try {
            await Share.share({
                url: processedImage.data.uri,
                title: 'Share Image',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share image');
        }
    }, [processedImage]);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Header title="Remove Background" onBackPress={goback} />

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.previewContainer}>
                        <ImagePreview
                            imageUri={processedImage?.data?.uri || selectedImage?.uri}
                            imageData={processedImage?.data || selectedImage}
                            label={processedImage?.data ? "Background Removed" : "Original Image"}
                        />
                    </View>

                    {selectedImage && (
                        <View style={styles.controlsContainer}>
                            <Text style={styles.label}>Sensitivity: {sensitivity}%</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={10}
                                maximumValue={100}
                                step={5}
                                value={sensitivity}
                                onValueChange={setSensitivity}
                                minimumTrackTintColor={colors.brand.primary}
                                maximumTrackTintColor={colors.ui.border}
                                thumbTintColor={colors.brand.primary}
                            />
                            <View style={styles.qualityLabels}>
                                <Text style={styles.qualityText}>Subtle</Text>
                                <Text style={styles.qualityText}>Aggressive</Text>
                            </View>
                            <View style={styles.infoBox}>
                                <Text style={styles.infoText}>
                                    ℹ️ Higher sensitivity removes more background but may affect edges
                                </Text>
                            </View>
                        </View>
                    )}

                    <ActionButtons
                        onPickImage={handlePickImage}
                        onAction={handleRemoveBackground}
                        actionLabel="Remove Background"
                        isProcessing={isProcessing}
                        hasImage={!!selectedImage}
                        onSave={processedImage?.data ? handleSave : undefined}
                        onShare={processedImage?.data ? handleShare : undefined}
                        isSaving={isSaving}
                    />
                </ScrollView>

                <ProcessingOverlay visible={isProcessing} message="Removing background..." />
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
    slider: {
        width: '100%',
        height: 40,
    },
    qualityLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    qualityText: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
    },
    infoBox: {
        marginTop: 12,
        padding: 10,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.brand.primary,
    },
    infoText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        lineHeight: 18,
    },
});

export default RemoveBackgroundScreen;
