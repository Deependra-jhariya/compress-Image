import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Modal } from 'react-native';
import { colors, spacing, typography } from '../../../core/themes';

interface ProcessingOverlayProps {
    visible: boolean;
    message?: string;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
    visible,
    message = 'Processing...',
}) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <ActivityIndicator size="large" color={colors.brand.primary} />
                    <Text style={styles.message}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: colors.ui.card,
        padding: spacing.xl,
        borderRadius: 16,
        alignItems: 'center',
        minWidth: 200,
    },
    message: {
        marginTop: spacing.md,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
    },
});
