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

const FORMATS = [
    { label: 'JPEG', value: ImageFormat.JPEG, description: 'Best for photos' },
    { label: 'PNG', value: ImageFormat.PNG, description: 'Best for transparency' },
    { label: 'WEBP', value: ImageFormat.WEBP, description: 'Modern efficient format' },
];

const ConvertScreen = () => {
    const { goback } = useAppNavigation();
    const { saveImage } = useSaveImage();
    const { isProcessing, processedImage, processImage, resetProcessor } = useImageProcessor();
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<ImageFormat>(ImageFormat.JPEG);

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
                    format: ImageFormat.JPEG, // Default assumption
                    timestamp: Date.now(),
                });
                resetProcessor();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    }, [resetProcessor]);

    const handleConvert = useCallback(async () => {
        if (!selectedImage) return;

        await processImage(
            () => imageRepository.convertFormat(selectedImage.uri, selectedFormat),
            'Image converted successfully'
        );
    }, [selectedImage, selectedFormat, processImage]);

    const handleSave = useCallback(async () => {
        if (!processedImage?.data) return;
        await saveImage(processedImage.data.uri, processedImage.data.fileName);
    }, [processedImage, saveImage]);

    const handleShare = useCallback(async () => {
        if (!processedImage?.data) return;
        try {
            await Share.share({
                url: processedImage.data.uri,
                title: 'Share Converted Image',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share image');
        }
    }, [processedImage]);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Header title="Convert Format" onBackPress={goback} />

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.previewContainer}>
                        <ImagePreview
                            imageUri={processedImage?.data?.uri || selectedImage?.uri}
                            imageData={processedImage?.data || selectedImage}
                            label={processedImage?.data ? "Converted Result" : "Original Image"}
                        />
                    </View>

                    {selectedImage && (
                        <View style={styles.controlsContainer}>
                            <Text style={styles.label}>Target Format:</Text>
                            <View style={styles.formatList}>
                                {FORMATS.map((format) => (
                                    <TouchableOpacity
                                        key={format.value}
                                        style={[
                                            styles.formatButton,
                                            selectedFormat === format.value && styles.formatButtonActive
                                        ]}
                                        onPress={() => setSelectedFormat(format.value)}
                                    >
                                        <View>
                                            <Text style={[
                                                styles.formatLabel,
                                                selectedFormat === format.value && styles.formatLabelActive
                                            ]}>
                                                {format.label}
                                            </Text>
                                            <Text style={[
                                                styles.formatDescription,
                                                selectedFormat === format.value && styles.formatDescriptionActive
                                            ]}>
                                                {format.description}
                                            </Text>
                                        </View>
                                        {selectedFormat === format.value && (
                                            <Text style={styles.checkIcon}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    <ActionButtons
                        onPickImage={handlePickImage}
                        onAction={handleConvert}
                        actionLabel="Convert Format"
                        isProcessing={isProcessing}
                        hasImage={!!selectedImage}
                        onSave={processedImage?.data ? handleSave : undefined}
                        onShare={processedImage?.data ? handleShare : undefined}
                    />
                </ScrollView>

                <ProcessingOverlay visible={isProcessing} message="Converting format..." />
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
    formatList: {
        gap: 8,
    },
    formatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
        backgroundColor: colors.background.tertiary,
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    formatButtonActive: {
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primary,
    },
    formatLabel: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
        marginBottom: 2,
    },
    formatLabelActive: {
        color: colors.text.inverse,
    },
    formatDescription: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
    },
    formatDescriptionActive: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    checkIcon: {
        color: colors.text.inverse,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ConvertScreen;
