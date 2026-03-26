import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, spacing, fontSize } from '../src/constants/theme';
import { Button } from '../src/components/ui';

/**
 * Location Permission screen matching wireframe:
 * - MapPin icon in large circle
 * - "Enable Location Services" title
 * - Short description
 * - "Allow Location Access" button (primary)
 * - "Skip" text link
 * - Navigates to onboarding after
 */
export default function LocationPermissionScreen() {
  const handleAllowLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        await Location.getCurrentPositionAsync({});
      }
    } catch (error) {
      console.error('Location error:', error);
    }
    // Navigate to onboarding regardless
    router.replace('/onboarding');
  };

  const handleSkip = () => {
    router.replace('/onboarding');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Location Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={64} color={colors.primary} />
        </View>

        {/* Title and Description */}
        <Text style={styles.title}>Enable Location Services</Text>
        <Text style={styles.description}>
          DoHuub uses your location to show nearby services and providers
        </Text>

        {/* Allow Button */}
        <View style={styles.buttons}>
          <Button
            title="Allow Location Access"
            onPress={handleAllowLocation}
            fullWidth
          />
        </View>

        {/* Skip Link */}
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
    maxWidth: 320,
  },
  buttons: {
    width: '100%',
    maxWidth: 320,
  },
  skipButton: {
    marginTop: spacing.xl,
    padding: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.md,
    color: colors.primary,
  },
});

