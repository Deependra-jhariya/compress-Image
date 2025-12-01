import React from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { FeatureCard } from '../molecules/FeatureCard';
import { ImageFeature } from '../../../core/entities/ImageFeature';
import { spacing } from '../../../core/themes';

const { width } = Dimensions.get('window');
const CARD_MARGIN = spacing.card.margin;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - spacing.screen.horizontal * 2 - CARD_MARGIN * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export interface FeatureGridProps {
    features: ImageFeature[];
    onFeaturePress: (feature: ImageFeature) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
    features,
    onFeaturePress,
}) => {
    const renderFeatureCard = ({ item, index }: { item: ImageFeature; index: number }) => {
        return (
            <FeatureCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                color={item.color}
                onPress={() => onFeaturePress(item)}
                delay={index * 100}
                style={styles.card}
            />
        );
    };

    return (
        <FlatList
            data={features}
            renderItem={renderFeatureCard}
            keyExtractor={(item) => item.id}
            numColumns={NUM_COLUMNS}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.screen.horizontal,
        paddingBottom: spacing.xxl,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: CARD_MARGIN,
    },
    card: {
        width: CARD_WIDTH,
    },
});
