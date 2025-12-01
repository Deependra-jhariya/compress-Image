import React, { useRef, useEffect } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    ViewStyle,
} from 'react-native';
import { IconContainer } from '../atoms/IconContainer';
import { colors, spacing, typography } from '../../../core/themes';

export interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
    color: string;
    onPress: () => void;
    delay?: number;
    style?: ViewStyle;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    icon,
    color,
    onPress,
    delay = 0,
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={[
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                },
                style,
            ]}
        >
            <TouchableOpacity
                style={[
                    styles.card,
                    {
                        borderColor: `${color}33`,
                        backgroundColor: colors.ui.card,
                    },
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
            >
                <IconContainer icon={icon} size={56} backgroundColor={color} />

                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>

                <Text style={styles.description} numberOfLines={2}>
                    {description}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: spacing.base,
        borderWidth: 1,
        alignItems: 'center',
        minHeight: 160,
        justifyContent: 'center',
        shadowColor: colors.brand.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginTop: spacing.md,
        textAlign: 'center',
    },
    description: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
        textAlign: 'center',
        lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
    },
});
