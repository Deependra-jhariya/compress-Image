import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TextInput, Switch, TouchableOpacity, Share } from 'react-native';
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

const ResizeScreen = () => {
    const { goback } = useAppNavigation();
    const { saveImage } = useSaveImage();
    const { isProcessing, processedImage, processImage, resetProcessor } = useImageProcessor();
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [width, setWidth] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
    const [aspectRatio, setAspectRatio] = useState<number>(1);

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
                const imgWidth = asset.width || 0;
                const imgHeight = asset.height || 0;

                setSelectedImage({
                    uri: asset.uri,
                    fileName: asset.fileName || 'image.jpg',
                    fileSize: asset.fileSize || 0,
                    width: imgWidth,
                    height: imgHeight,
                    format: ImageFormat.JPEG,
                    timestamp: Date.now(),
                });

                setWidth(imgWidth.toString());
                setHeight(imgHeight.toString());
                setAspectRatio(imgWidth / imgHeight);
                resetProcessor();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    }, [resetProcessor]);

    const handleWidthChange = (text: string) => {
        setWidth(text);
        if (maintainAspectRatio && text && !isNaN(Number(text))) {
            const newWidth = parseInt(text);
            const newHeight = Math.round(newWidth / aspectRatio);
            setHeight(newHeight.toString());
        }
    };

    const handleHeightChange = (text: string) => {
        setHeight(text);
        if (maintainAspectRatio && text && !isNaN(Number(text))) {
            const newHeight = parseInt(text);
            const newWidth = Math.round(newHeight * aspectRatio);
            setWidth(newWidth.toString());
        }
    };

    const handleResize = useCallback(async () => {
        if (!selectedImage) return;

        const targetWidth = parseInt(width);
        const targetHeight = parseInt(height);

        if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
            Alert.alert('Error', 'Please enter valid dimensions');
            return;
        }

        await processImage(
            () => imageRepository.resizeImage(selectedImage.uri, targetWidth, targetHeight),
            'Image resized successfully'
        );
    }, [selectedImage, width, height, processImage]);

    const handleSave = useCallback(async () => {
        if (!processedImage?.data) return;
        await saveImage(processedImage.data.uri, processedImage.data.fileName);
    }, [processedImage, saveImage]);

    const handleShare = useCallback(async () => {
        if (!processedImage?.data) return;
        try {
            await Share.share({
                url: processedImage.data.uri,
                title: 'Share Resized Image',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share image');
        }
    }, [processedImage]);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Header title="Resize Image" onBackPress={goback} />

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.previewContainer}>
                        <ImagePreview
                            imageUri={processedImage?.data?.uri || selectedImage?.uri}
                            imageData={processedImage?.data || selectedImage}
                            label={processedImage?.data ? "Resized Result" : "Original Image"}
                        />
                    </View>

                    {selectedImage && (
                        <View style={styles.controlsContainer}>
                            <View style={styles.inputRow}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Width (px)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={width}
                                        onChangeText={handleWidthChange}
                                        keyboardType="numeric"
                                        placeholder="Width"
                                        placeholderTextColor={colors.text.disabled}
                                    />
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Height (px)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={height}
                                        onChangeText={handleHeightChange}
                                        keyboardType="numeric"
                                        placeholder="Height"
                                        placeholderTextColor={colors.text.disabled}
                                    />
                                </View>
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={styles.switchLabel}>Maintain Aspect Ratio</Text>
                                <Switch
                                    value={maintainAspectRatio}
                                    onValueChange={setMaintainAspectRatio}
                                    trackColor={{ false: colors.ui.border, true: colors.brand.primary }}
                                    thumbColor={colors.text.primary}
                                />
                            </View>

                            <View style={styles.presetsContainer}>
                                <Text style={styles.label}>Presets:</Text>
                                <View style={styles.presetButtons}>
                                    {[0.25, 0.5, 0.75].map((scale) => (
                                        <TouchableOpacity
                                            key={scale}
                                            style={styles.presetButton}
                                            onPress={() => {
                                                if (selectedImage) {
                                                    const newWidth = Math.round(selectedImage.width * scale);
                                                    handleWidthChange(newWidth.toString());
                                                }
                                            }}
                                        >
                                            <Text style={styles.presetText}>{scale * 100}%</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    )}

                    <ActionButtons
                        onPickImage={handlePickImage}
                        onAction={handleResize}
                        actionLabel="Resize Image"
                        isProcessing={isProcessing}
                        hasImage={!!selectedImage}
                        onSave={processedImage?.data ? handleSave : undefined}
                        onShare={processedImage?.data ? handleShare : undefined}
                    />
                </ScrollView>

                <ProcessingOverlay visible={isProcessing} message="Resizing image..." />
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
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.ui.border,
        shadowColor: colors.brand.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        gap: spacing.md,
    },
    inputGroup: {
        flex: 1,
    },
    label: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.background.secondary,
        borderRadius: 8,
        padding: spacing.sm,
        color: colors.text.primary,
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    switchLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
    },
    presetsContainer: {
        marginTop: 8,
    },
    presetButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    presetButton: {
        backgroundColor: colors.background.tertiary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    presetText: {
        fontSize: typography.fontSize.xs,
        color: colors.brand.primary,
        fontWeight: '600',
    },
});

export default ResizeScreen;
