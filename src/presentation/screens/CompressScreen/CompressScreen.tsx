import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Share, TouchableOpacity, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { GradientBackground } from '../../components/atoms/GradientBackground';
import { Header } from '../../components/molecules/Header';
import { ImagePreview } from '../../components/molecules/ImagePreview';
import { ActionButtons } from '../../components/molecules/ActionButtons';
import { ProcessingOverlay } from '../../components/molecules/ProcessingOverlay';
import { useAppNavigation, useSaveImage, useImageProcessor } from '../../../bussiness/hooks';
import { colors, spacing, typography } from '../../../core/themes';
import { ImageData, ImageFormat } from '../../../core/entities/ImageData';
import { imagePickerService } from '../../../data/services/ImagePickerService';
import { imageRepository } from '../../../data/repositories/ImageRepositoryImpl';
import { SafeAreaView } from 'react-native-safe-area-context';
const CompressScreen = () => {
    const { goback } = useAppNavigation();
    const { isSaving, saveImage } = useSaveImage();
    const { isProcessing, processedImage, processImage, resetProcessor } = useImageProcessor();
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [compressionMode, setCompressionMode] = useState<'quality' | 'size'>('quality');
    const [quality, setQuality] = useState<number>(80);
    const [targetSizeKB, setTargetSizeKB] = useState<string>('500');

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

    const handleCompress = useCallback(async () => {
        if (!selectedImage) return;

        if (compressionMode === 'quality') {
            await processImage(
                () => imageRepository.compressImage(selectedImage.uri, quality / 100),
                'Image compressed successfully'
            );
        } else {
            const size = parseInt(targetSizeKB);
            if (isNaN(size) || size <= 0) {
                Alert.alert('Error', 'Please enter a valid target size');
                return;
            }
            await processImage(
                () => imageRepository.compressImageToSize(selectedImage.uri, size),
                'Image compressed to target size'
            );
        }
    }, [selectedImage, compressionMode, quality, targetSizeKB, processImage]);

    const handleSave = useCallback(async () => {
        if (!processedImage?.data) return;
        await saveImage(processedImage.data.uri, processedImage.data.fileName);
    }, [processedImage, saveImage]);

    const handleShare = useCallback(async () => {
        if (!processedImage?.data) return;
        try {
            await Share.share({
                url: processedImage.data.uri,
                title: 'Share Compressed Image',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share image');
        }
    }, [processedImage]);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Header title="Compress Image" onBackPress={goback} />

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.previewContainer}>
                        <ImagePreview
                            imageUri={processedImage?.data?.uri || selectedImage?.uri}
                            imageData={processedImage?.data || selectedImage}
                            label={processedImage?.data ? "Compressed Result" : "Original Image"}
                        />
                    </View>

                    {selectedImage && (
                        <View style={styles.controlsContainer}>
                            <View style={styles.modeSwitch}>
                                <TouchableOpacity
                                    style={[styles.modeButton, compressionMode === 'quality' && styles.modeButtonActive]}
                                    onPress={() => setCompressionMode('quality')}
                                >
                                    <Text style={[styles.modeText, compressionMode === 'quality' && styles.modeTextActive]}>By Quality</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modeButton, compressionMode === 'size' && styles.modeButtonActive]}
                                    onPress={() => setCompressionMode('size')}
                                >
                                    <Text style={[styles.modeText, compressionMode === 'size' && styles.modeTextActive]}>Target Size (KB)</Text>
                                </TouchableOpacity>
                            </View>

                            {compressionMode === 'quality' ? (
                                <>
                                    <Text style={styles.label}>Quality: {quality}%</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={1}
                                        maximumValue={100}
                                        step={1}
                                        value={quality}
                                        onValueChange={setQuality}
                                        minimumTrackTintColor={colors.brand.primary}
                                        maximumTrackTintColor={colors.ui.border}
                                        thumbTintColor={colors.brand.primary}
                                    />
                                    <View style={styles.qualityLabels}>
                                        <Text style={styles.qualityText}>Low Size</Text>
                                        <Text style={styles.qualityText}>High Quality</Text>
                                    </View>
                                </>
                            ) : (
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Target Size (KB)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={targetSizeKB}
                                        onChangeText={setTargetSizeKB}
                                        keyboardType="numeric"
                                        placeholder="e.g. 500"
                                        placeholderTextColor={colors.text.disabled}
                                    />
                                    <Text style={styles.hint}>
                                        We'll try to compress to this size without losing too much quality.
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    <ActionButtons
                        onPickImage={handlePickImage}
                        onAction={handleCompress}
                        actionLabel={compressionMode === 'quality' ? "Compress" : "Compress to Size"}
                        isProcessing={isProcessing}
                        hasImage={!!selectedImage}
                        onSave={processedImage?.data ? handleSave : undefined}
                        onShare={processedImage?.data ? handleShare : undefined}
                        isSaving={isSaving}
                    />
                </ScrollView>

                <ProcessingOverlay visible={isProcessing} message={compressionMode === 'quality' ? "Compressing..." : "Optimizing size..."} />
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
    modeSwitch: {
        flexDirection: 'row',
        backgroundColor: colors.background.tertiary,
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    modeButtonActive: {
        backgroundColor: colors.ui.card,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    modeText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        fontWeight: typography.fontWeight.medium,
    },
    modeTextActive: {
        color: colors.brand.primary,
        fontWeight: typography.fontWeight.semibold,
    },
    inputGroup: {
        gap: 8,
    },
    input: {
        backgroundColor: colors.background.tertiary,
        borderWidth: 1,
        borderColor: colors.ui.border,
        borderRadius: 8,
        padding: 12,
        fontSize: typography.fontSize.md,
        color: colors.text.primary,
    },
    label: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    qualityLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    qualityText: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
    },
    hint: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
        textAlign: 'center',
        marginTop: 4,
    },
});

export default CompressScreen;
