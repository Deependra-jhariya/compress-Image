import React, { useCallback } from 'react';
import { StyleSheet, StatusBar, Alert } from 'react-native';
import { GradientBackground } from '../../components/atoms/GradientBackground';
import { Header } from '../../components/molecules/Header';
import { FeatureGrid } from '../../components/organisms/FeatureGrid';
import { IMAGE_FEATURES } from '../../../core/constants/features';
import { ImageFeature } from '../../../core/entities/ImageFeature';
import { useAppNavigation } from '../../../bussiness/hooks/navigationHelper/navigationHelper';
import { spacing } from '../../../core/themes';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const { navigateTo } = useAppNavigation();

    const handleFeaturePress = useCallback((feature: ImageFeature) => {
        navigateTo(feature.route as any);
    }, [navigateTo]);

    return (
        <GradientBackground>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={styles.container}>
                <Header />
                <FeatureGrid features={IMAGE_FEATURES} onFeaturePress={handleFeaturePress} />
            </SafeAreaView>
        </GradientBackground>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.base,
    },
});
