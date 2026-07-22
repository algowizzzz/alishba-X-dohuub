import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';

/**
 * Deep-link landing for Google OAuth (`doohub://auth/callback`).
 * Tokens are handled in `signInWithGoogle` via WebBrowser; this screen only
 * prevents the Expo Router "Unmatched Route" flash and sends the user home.
 */
export default function AuthCallbackScreen() {
  useEffect(() => {
    const t = setTimeout(() => {
      if (router.canGoBack()) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(tabs)');
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2E7AD9" />
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
});
