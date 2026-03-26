import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { spacing, fontSize, borderRadius } from '../../src/constants/theme';

/**
 * Sign In screen matching blue gradient wireframe:
 * - Blue gradient background
 * - Back button with white arrow
 * - White package icon + branding
 * - "Sign In to Your Account" heading in white
 * - Google Sign In button (white bg, dark text)
 * - Email Sign In button (white bg, blue text)
 * - "Don't have an account? Sign Up" link in white
 */
export default function SignInScreen() {
  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In
    alert('Google Sign-In coming soon!');
  };

  const handleEmailSignIn = () => {
    router.push('/(auth)/email-signin');
  };

  return (
    <View
      style={styles.container}
    >
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.centeredContent}>
        {/* Logo */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.heading}>Sign In to Your Account</Text>

        {/* Buttons */}
        <View style={styles.buttons}>
          {/* Google Sign In - white bg with dark text */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Svg width={20} height={20} viewBox="0 0 48 48">
              <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <Path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 000 24c0 3.77.9 7.34 2.56 10.51l7.97-5.92z"/>
              <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.92C6.51 42.62 14.62 48 24 48z"/>
            </Svg>
            <Text style={styles.googleButtonText}>Sign In with Google</Text>
          </TouchableOpacity>

          {/* Email Sign In - white bg with blue text */}
          <TouchableOpacity style={styles.emailButton} onPress={handleEmailSignIn}>
            <Ionicons name="mail" size={20} color="#1D4ADD" style={{ marginRight: spacing.sm }} />
            <Text style={styles.emailButtonText}>Sign In with Email</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/welcome')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7AD9',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.sm,
  },
  centeredContent: {
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
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  emailButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#1D4ADD',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signUpText: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.85)',
  },
  signUpLink: {
    fontSize: fontSize.md,
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
