import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

/**
 * Splash screen matching wireframe:
 * - Blue gradient background
 * - Package icon (cube) in circle
 * - DoHuub brand
 * - "Infinite Services" tagline
 * - Loading spinner
 * - Auto-navigates: Splash → LocationPermission → Onboarding → Auth
 */
export default function SplashScreen() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else if (hasCompletedOnboarding) {
        router.replace('/(auth)/welcome');
      } else {
        router.replace('/location-permission');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <ActivityIndicator
        size="large"
        color="#FFFFFF"
        style={styles.spinner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E7AD9',
  },
  logoImage: {
    width: 300,
    height: 300,
  },
  spinner: {
    marginTop: 48,
  },
});
