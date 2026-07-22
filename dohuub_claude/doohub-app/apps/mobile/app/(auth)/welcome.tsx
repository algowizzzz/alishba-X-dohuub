import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { signInWithGoogle } from '../../src/services/googleSignIn';

/**
 * Welcome/Auth screen matching blue gradient wireframe:
 * - Blue gradient background (#4CA6FA -> #1D4ADD)
 * - White package icon (box)
 * - "DoHuub" title in white
 * - "Infinite Services" subtitle in white
 * - "Create Your Account" heading in white
 * - Google Sign Up button (white bg, dark text)
 * - Email Sign Up button (white bg, blue text)
 * - Sign In button (transparent with white border)
 * - Terms footer pinned to bottom (safe area)
 */
export default function WelcomeScreen() {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const outcome = await signInWithGoogle();
      if (outcome === 'success') {
        // Prefer home tab explicitly — avoids any unmatched-route flash from
        // the OAuth deep link (doohub://auth/callback) racing navigation.
        router.replace('/(tabs)/');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSignUp = () => {
    router.push('/(auth)/register');
  };

  const handleSignIn = () => {
    router.push('/(auth)/signin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.heading}>Create Your Account</Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignUp}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#1A1A2E" />
            ) : (
              <>
                <Svg width={20} height={20} viewBox="0 0 48 48">
                  <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <Path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 000 24c0 3.77.9 7.34 2.56 10.51l7.97-5.92z"/>
                  <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.92C6.51 42.62 14.62 48 24 48z"/>
                </Svg>
                <Text style={styles.googleButtonText}>Sign Up with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUpButton} onPress={handleEmailSignUp}>
            <Ionicons name="mail" size={20} color="#FFFFFF" style={{ marginRight: spacing.sm }} />
            <Text style={styles.signUpButtonText}>Sign Up with Email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.terms}>
        By continuing, you agree to our{' '}
        <Text style={styles.termsLink} onPress={() => router.push('/terms')}>
          Terms of Service
        </Text>
        {' '}and{' '}
        <Text style={styles.termsLink} onPress={() => router.push('/privacy')}>
          Privacy Policy
        </Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7AD9',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoImage: {
    width: 280,
    height: 280,
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: fontSize.lg,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: spacing.xxl,
  },
  buttons: {
    width: '100%',
    maxWidth: 320,
    gap: spacing.md,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    minHeight: 52,
  },
  googleButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#374151',
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  signUpButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signInText: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.85)',
  },
  signInLink: {
    fontSize: fontSize.md,
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  terms: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  termsLink: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});
