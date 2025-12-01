import React from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { colors } from '../../../core/themes';

const { height } = Dimensions.get('window');

export interface GradientBackgroundProps {
    children?: React.ReactNode;
    style?: ViewStyle;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.gradientTop} />
            <View style={styles.gradientBottom} />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    gradientTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.4,
        backgroundColor: colors.brand.primary,
        opacity: 0.1,
        borderBottomLeftRadius: height * 0.2,
        borderBottomRightRadius: height * 0.2,
    },
    gradientBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.4,
        backgroundColor: colors.brand.secondary,
        opacity: 0.08,
        borderTopLeftRadius: height * 0.2,
        borderTopRightRadius: height * 0.2,
    },
});
