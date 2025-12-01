import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../../core/themes';

export interface HeaderProps {
    title?: string;
    subtitle?: string;
    style?: ViewStyle;
    onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'CompressImage',
    subtitle = 'Professional Image Tools',
    style,
    onBackPress,
}) => {
    return (
        <View style={[styles.container, style]}>
            {onBackPress ? (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBackPress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.logoContainer}>
                    <Text style={styles.logoIcon}>📷</Text>
                </View>
            )}

            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.screen.horizontal,
        paddingVertical: spacing.base,
    },
    logoContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: `${colors.brand.primary}15`, // 15 = ~8% opacity
        borderWidth: 2,
        borderColor: `${colors.brand.primary}33`, // 33 = ~20% opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    logoIcon: {
        fontSize: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${colors.brand.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    backIcon: {
        fontSize: 24,
        color: colors.brand.primary,
        fontWeight: 'bold',
        marginBottom: 2, // Visual alignment
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginTop: 2,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
