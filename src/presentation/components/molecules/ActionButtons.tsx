import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ViewStyle, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../../../core/themes';

interface ActionButtonsProps {
    onPickImage: () => void;
    onAction: () => void;
    actionLabel: string;
    isProcessing?: boolean;
    hasImage?: boolean;
    onSave?: () => void;
    onShare?: () => void;
    style?: ViewStyle;
    isSaving?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onPickImage,
    onAction,
    actionLabel,
    isProcessing = false,
    hasImage = false,
    onSave,
    onShare,
    style,
    isSaving = false,
}) => {
    return (
        <View style={[styles.container, style]}>
            {!hasImage ? (
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={onPickImage}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Select Image</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.actionsWrapper}>
                    <View style={styles.mainActions}>
                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={onPickImage}
                            disabled={isProcessing || isSaving}
                        >
                            <Text style={styles.secondaryButtonText}>Change</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.primaryButton,
                                isProcessing && styles.disabledButton,
                            ]}
                            onPress={onAction}
                            disabled={isProcessing || isSaving}
                        >
                            {isProcessing ? (
                                <ActivityIndicator color={colors.text.inverse} size="small" />
                            ) : (
                                <Text style={styles.primaryButtonText}>{actionLabel}</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {(onSave || onShare) && (
                        <View style={styles.resultActions}>
                            {onSave && (
                                <TouchableOpacity
                                    style={[styles.button, styles.successButton]}
                                    onPress={onSave}
                                    disabled={isProcessing || isSaving}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator color={colors.text.inverse} size="small" />
                                    ) : (
                                        <Text style={styles.successButtonText}>Save to Gallery</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                            {onShare && (
                                <TouchableOpacity
                                    style={[styles.button, styles.outlineButton]}
                                    onPress={onShare}
                                    disabled={isProcessing || isSaving}
                                >
                                    <Text style={styles.outlineButtonText}>Share</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: spacing.md,
    },
    actionsWrapper: {
        gap: spacing.md,
    },
    mainActions: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    resultActions: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: colors.brand.primary,
    },
    primaryButtonText: {
        color: colors.text.inverse,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    },
    secondaryButton: {
        backgroundColor: colors.ui.card,
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    secondaryButtonText: {
        color: colors.text.primary,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
    },
    successButton: {
        backgroundColor: colors.status.success,
    },
    successButtonText: {
        color: colors.text.inverse,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.brand.primary,
    },
    outlineButtonText: {
        color: colors.brand.primary,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
    },
    disabledButton: {
        opacity: 0.7,
    },
});
