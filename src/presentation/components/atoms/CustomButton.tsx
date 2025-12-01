import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { colors, spacing, typography } from '../../../core/themes';

export interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
    textStyle,
}) => {
    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            ...styles.button,
            ...styles[`${variant}Button` as keyof typeof styles],
            ...styles[`${size}Button` as keyof typeof styles],
        };

        if (fullWidth) {
            baseStyle.width = '100%';
        }

        if (disabled) {
            baseStyle.opacity = 0.5;
        }

        return baseStyle;
    };

    const getTextStyle = (): TextStyle => {
        return {
            ...styles.buttonText,
            ...styles[`${variant}Text` as keyof typeof styles],
            ...styles[`${size}Text` as keyof typeof styles],
        };
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' ? colors.brand.purple : colors.text.primary}
                    size="small"
                />
            ) : (
                <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    // Variants
    primaryButton: {
        backgroundColor: colors.brand.purple,
        shadowColor: colors.brand.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    secondaryButton: {
        backgroundColor: colors.brand.cyan,
        shadowColor: colors.brand.cyan,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.brand.purple,
    },

    // Sizes
    smallButton: {
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        minHeight: 36,
    },
    mediumButton: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        minHeight: 44,
    },
    largeButton: {
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.base,
        minHeight: 52,
    },

    // Text styles
    buttonText: {
        fontWeight: typography.fontWeight.semibold,
    },
    primaryText: {
        color: colors.text.primary,
    },
    secondaryText: {
        color: colors.text.primary,
    },
    outlineText: {
        color: colors.brand.purple,
    },
    smallText: {
        fontSize: typography.fontSize.sm,
    },
    mediumText: {
        fontSize: typography.fontSize.md,
    },
    largeText: {
        fontSize: typography.fontSize.lg,
    },
});
