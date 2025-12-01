import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../../core/themes';

export interface IconContainerProps {
    icon: string;
    size?: number;
    backgroundColor?: string;
    gradient?: string[];
    style?: ViewStyle;
}

export const IconContainer: React.FC<IconContainerProps> = ({
    icon,
    size = 60,
    backgroundColor = colors.brand.purple,
    style,
}) => {
    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 4,
                    backgroundColor: `${backgroundColor}33`, // 20% opacity
                    borderColor: `${backgroundColor}66`, // 40% opacity
                },
                style,
            ]}
        >
            <View
                style={[
                    styles.innerContainer,
                    {
                        width: size * 0.8,
                        height: size * 0.8,
                        borderRadius: (size * 0.8) / 4,
                        backgroundColor: `${backgroundColor}4D`, // 30% opacity
                    },
                ]}
            >
                <Text style={[styles.icon, { fontSize: size * 0.45 }]}>{icon}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        textAlign: 'center',
    },
});
