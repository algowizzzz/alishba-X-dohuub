import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { Button, Stepper } from '../../src/components/ui';

type AddressType = 'Home' | 'Work' | 'Other';

interface AddressItem {
  type: AddressType;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  added: boolean;
}

/**
 * Address Setup screen (Step 2 of 2) matching wireframe:
 * - Step indicator "Step 2 of 2"
 * - "Add Your Addresses" title
 * - "Save time by adding your frequent locations" subtitle
 * - Home, Work, Other address buttons with Plus icons
 * - Done button
 * - Skip for Now link
 */
export default function AddressSetupScreen() {
  const [addresses, setAddresses] = useState<AddressItem[]>([
    { type: 'Home', label: 'Home', description: 'Add your home address', icon: 'home', added: false },
    { type: 'Work', label: 'Work', description: 'Add your work address', icon: 'briefcase', added: false },
    { type: 'Other', label: 'Other', description: 'Add another location', icon: 'location', added: false },
  ]);

  const handleAddAddress = (type: AddressType) => {
    // TODO: Navigate to add address form with type
    router.push({
      pathname: '/profile/add-address',
      params: { type },
    });
  };

  const handleDone = () => {
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <Stepper currentStep={2} totalSteps={2} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Add Your Addresses</Text>
          <Text style={styles.subtitle}>
            Save time by adding your frequent locations
          </Text>

          {/* Address Buttons */}
          <View style={styles.addressList}>
            {addresses.map((address) => (
              <TouchableOpacity
                key={address.type}
                style={styles.addressButton}
                onPress={() => handleAddAddress(address.type)}
              >
                <View style={styles.addressIcon}>
                  <Ionicons name={address.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressLabel}>{address.label}</Text>
                  <Text style={styles.addressDescription}>{address.description}</Text>
                </View>
                <Ionicons
                  name={address.added ? 'checkmark-circle' : 'add'}
                  size={24}
                  color={address.added ? colors.status.success : colors.text.muted}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Button title="Done" onPress={handleDone} fullWidth />
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for Now</Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  addressList: {
    gap: spacing.sm,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  addressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: fontSize.md,
    fontWeight: '400',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  addressDescription: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.default,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    gap: spacing.sm,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.md,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});

