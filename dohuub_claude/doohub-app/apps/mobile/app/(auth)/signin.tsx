import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { signInWithGoogle } from '../../src/services/googleSignIn';

/**
 * Sign In screen — exact match to boss wireframe (SignInScreen.tsx):
 * - Gradient blue background
 * - ArrowLeft + "Back" in white
 * - Logo centered
 * - Google Sign In button (white/90% opacity)
 * - Email Sign In button (transparent, white border)
 * - "Don't have an account? Sign Up"
 */
export default function SignInScreen() {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const outcome = await signInWithGoogle();
      if (outcome === 'success') {
        router.replace('/(tabs)');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSignIn = () => {
    router.push('/(auth)/email-signin');
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(auth)/welcome')}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centeredContent}>
        {/* Logo */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Buttons */}
        <View style={styles.buttons}>
          {/* Google Sign In - white bg */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#1A1A2E" />
            ) : (
              <>
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </Svg>
                <Text style={styles.googleButtonText}>Sign In with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Email Sign In - transparent with white border */}
          <TouchableOpacity style={styles.emailButton} onPress={handleEmailSignIn}>
            <Ionicons name="mail-outline" size={24} color="#FFFFFF" />
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
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoImage: {
    width: 280,
    height: 280,
    marginBottom: 24,
  },
  buttons: {
    width: '100%',
    maxWidth: 340,
    gap: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    minHeight: 56,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D4ADD',
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    minHeight: 56,
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  signUpText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  signUpLink: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
