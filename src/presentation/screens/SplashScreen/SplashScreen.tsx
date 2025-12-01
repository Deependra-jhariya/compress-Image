import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useAppNavigation } from '../../../bussiness/hooks/navigationHelper/navigationHelper'

const { width, height } = Dimensions.get('window')

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.3)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const { replaceTo } = useAppNavigation()

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start()

    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start()

    // Navigate to HomeScreen after 2.5 seconds
    const timer = setTimeout(() => {
      replaceTo('HomeScreen')
    }, 2500)

    return () => clearTimeout(timer)
  }, [replaceTo])

  return (
    <View style={styles.container}>
      {/* Gradient Background Effect using overlapping views */}
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Text style={styles.logoIcon}>📷</Text>
              <View style={styles.compressArrows}>
                <Text style={styles.arrowText}>↓</Text>
                <Text style={styles.arrowText}>↓</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* App Name */}
        <Text style={styles.appName}>CompressImage</Text>
        <Text style={styles.tagline}>Optimize. Compress. Perfect.</Text>
      </Animated.View>

      {/* Bottom Accent */}
      <View style={styles.bottomAccent}>
        <View style={styles.accentBar} />
      </View>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: '#6366f1',
    opacity: 0.15,
    borderBottomLeftRadius: height * 0.3,
    borderBottomRightRadius: height * 0.3,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: '#06b6d4',
    opacity: 0.1,
    borderTopLeftRadius: height * 0.3,
    borderTopRightRadius: height * 0.3,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoOuter: {
    width: 140,
    height: 140,
    borderRadius: 35,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  logoInner: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoIcon: {
    fontSize: 50,
    marginBottom: 5,
  },
  compressArrows: {
    position: 'absolute',
    right: 10,
    top: 10,
    flexDirection: 'column',
    gap: -8,
  },
  arrowText: {
    fontSize: 20,
    color: '#06b6d4',
    fontWeight: 'bold',
    textShadowColor: 'rgba(6, 182, 212, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: 'rgba(99, 102, 241, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: 14,
    color: '#94a3b8',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  accentBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
})