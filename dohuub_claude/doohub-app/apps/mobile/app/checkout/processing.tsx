import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../../src/constants/theme';

/**
 * Booking confirmation transition screen.
 * The booking was already created on the previous screen — this is just a
 * brief visual handoff before the confirmation page renders.
 * (Demo mode — no payment was actually charged.)
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
    // Short visual handoff — booking is already persisted by now.
    const t = setTimeout(() => setIsSuccess(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(() => {
        router.replace({
          pathname: '/checkout/confirmation',
          params: { serviceName, amount, date, time, bookingId },
        });
      }, 500);
      return () => clearTimeout(t);
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
            <Text style={styles.heading}>Confirming booking</Text>
            <Text style={styles.subtext}>
              Almost done — saving your booking with the vendor.
            </Text>
          </>
        ) : (
          <>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={56} color={colors.text.inverse} />
            </View>
            <Text style={styles.heading}>Booking confirmed!</Text>
            <Text style={styles.subtext}>
              The vendor has been notified. (Demo mode — no payment was charged.)
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
