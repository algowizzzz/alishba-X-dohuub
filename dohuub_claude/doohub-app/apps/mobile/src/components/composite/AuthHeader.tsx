import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderWidth } from '../../constants/theme';
import { Stepper } from '../ui/Stepper';

interface AuthHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

/**
 * Auth header matching wireframe:
 * - Back button on left (optional)
 * - Step indicator (optional)
 * - 2px bottom border
 */
export function AuthHeader({
  showBack = true,
  onBack,
  currentStep,
  totalSteps,
}: AuthHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // If we have steps, show the stepper
  if (currentStep && totalSteps) {
    return (
      <View style={styles.stepperContainer}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        <Stepper currentStep={currentStep} totalSteps={totalSteps} />
      </View>
    );
  }

  // Simple back button header
  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: borderWidth.default,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  stepperContainer: {
    borderBottomWidth: borderWidth.default,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: spacing.md,
    marginTop: spacing.sm,
  },
});

