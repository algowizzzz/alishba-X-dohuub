import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { Button } from '../../src/components/ui';
import { supabase } from '../../src/lib/supabase';

/**
 * Referral Code Setup Screen (optional onboarding step):
 * - "Have a Referral Code?" prompt
 * - Code input field
 * - Bonus info box
 * - Apply & Continue / Skip buttons
 */
export default function ReferralCodeScreen() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      // No code entered, just continue
      router.push('/(auth)/address-setup');
      return;
    }

    setIsApplying(true);
    setError('');

    try {
      // Look up referral code
      const { data, error: fetchError } = await supabase
        .from('Referral')
        .select('id, referrerId')
        .eq('code', code.trim().toUpperCase())
        .eq('status', 'PENDING')
        .single();

      if (fetchError || !data) {
        setError('Invalid or expired referral code. Please try again.');
        setIsApplying(false);
        return;
      }

      // Code is valid - continue to address setup
      router.push('/(auth)/address-setup');
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/address-setup');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <Text style={styles.almostDone}>Almost Done!</Text>

            {/* Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="gift" size={48} color="#F59E0B" />
            </View>

            {/* Title & Description */}
            <Text style={styles.title}>Have a Referral Code?</Text>
            <Text style={styles.description}>
              Enter your referral code to earn bonus rewards when you complete your first booking
            </Text>

            {/* Code Input */}
            <TextInput
              style={[styles.codeInput, error ? styles.codeInputError : null]}
              placeholder="Enter code"
              placeholderTextColor={colors.text.muted}
              value={code}
              onChangeText={(text) => {
                setCode(text.toUpperCase());
                setError('');
              }}
              autoCapitalize="characters"
              maxLength={10}
              textAlign="center"
            />

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            {/* Bonus Info Box */}
            <View style={styles.bonusBox}>
              <Text style={styles.bonusText}>
                Both you and your friend will earn{' '}
                <Text style={styles.bonusBold}>500 bonus points</Text>{' '}
                when you complete your first booking!
              </Text>
            </View>

            {/* Buttons */}
            <Button
              title={code.trim() ? 'Apply & Continue' : 'Continue'}
              onPress={handleApply}
              loading={isApplying}
              fullWidth
            />

            <View style={styles.skipContainer}>
              <Text style={styles.skipButton} onPress={handleSkip}>
                Skip for Now
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
    alignItems: 'center',
  },
  almostDone: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  codeInput: {
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  codeInputError: {
    borderColor: colors.status.error,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.status.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  bonusBox: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: '#FEF3C7',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  bonusText: {
    fontSize: fontSize.sm,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
  bonusBold: {
    fontWeight: '700',
  },
  skipContainer: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  skipButton: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});
