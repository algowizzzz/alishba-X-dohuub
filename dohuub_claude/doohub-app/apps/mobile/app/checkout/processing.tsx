import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../../src/constants/theme';

/**
 * Payment Processing Screen matching wireframe:
 * - Processing state with spinner (~2 seconds)
 * - Success state with checkmark (~1 second)
 * - Auto-navigates to confirmation
 */
export default function PaymentProcessingScreen() {
  const { serviceName, amount, date, time, bookingId } = useLocalSearchParams<{
    serviceName: string;
    amount: string;
    date: string;
    time: string;
    bookingId: string;
  }>();

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Show processing for 2 seconds
    const processingTimer = setTimeout(() => {
      setIsSuccess(true);
    }, 2000);

    return () => clearTimeout(processingTimer);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      // Show success for 1 second then navigate
      const successTimer = setTimeout(() => {
        router.replace({
          pathname: '/checkout/confirmation',
          params: { serviceName, amount, date, time, bookingId },
        });
      }, 1000);

      return () => clearTimeout(successTimer);
    }
  }, [isSuccess]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {!isSuccess ? (
          <>
            <View style={styles.iconCircle}>
              <ActivityIndicator size="large" color={colors.text.inverse} />
            </View>
            <Text style={styles.heading}>Processing Payment</Text>
            <Text style={styles.subtext}>
              Please wait while we process your payment...
            </Text>
          </>
        ) : (
          <>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={56} color={colors.text.inverse} />
            </View>
            <Text style={styles.heading}>Payment Successful!</Text>
            <Text style={styles.subtext}>
              Your booking has been confirmed
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
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
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heading: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtext: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
