import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../../core/themes';
import { ImageData } from '../../../core/entities/ImageData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImagePreviewProps {
    imageUri?: string;
    imageData?: ImageData | null;
    style?: ViewStyle;
    label?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
    imageUri,
    imageData,
    style,
    label,
}) => {
    if (!imageUri) {
        return (
            <View style={[styles.container, styles.emptyContainer, style]}>
                <Text style={styles.emptyText}>No image selected</Text>
            </View>
        );
    }

    const formatSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            {imageData && (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        {imageData.width} x {imageData.height}
                    </Text>
                    <Text style={styles.infoText}>•</Text>
                    <Text style={styles.infoText}>
                        {formatSize(imageData.fileSize)}
                    </Text>
                    <Text style={styles.infoText}>•</Text>
                    <Text style={styles.infoText}>
                        {imageData.format}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    emptyContainer: {
        height: 200,
        backgroundColor: colors.ui.card,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.ui.border,
        borderStyle: 'dashed',
    },
    emptyText: {
        color: colors.text.secondary,
        fontSize: typography.fontSize.md,
    },
    label: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
        alignSelf: 'flex-start',
        marginLeft: spacing.xs,
    },
    imageWrapper: {
        width: '100%',
        height: 250,
        backgroundColor: colors.background.secondary,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        flexDirection: 'row',
        marginTop: spacing.sm,
        backgroundColor: colors.ui.card,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    infoText: {
        color: colors.text.secondary,
        fontSize: typography.fontSize.xs,
        marginHorizontal: spacing.xs / 2,
        fontWeight: typography.fontWeight.medium,
    },
});
