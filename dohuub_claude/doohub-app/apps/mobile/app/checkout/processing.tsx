import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../../src/constants/theme';
import api from '../../src/services/api';

type PaymentState = 'checking' | 'paid' | 'pending' | 'failed';

/**
 * Post-Stripe-checkout handoff screen.
 *
 * We've just returned from the Stripe-hosted Checkout (or the user cancelled).
 * The webhook is the source of truth for payment state — but we poll the
 * session endpoint once or twice for immediate UX feedback.
 */
export default function PaymentProcessingScreen() {
  const { serviceName, amount, date, time, bookingId, sessionId, browserResult } =
    useLocalSearchParams<{
      serviceName: string;
      amount: string;
      date: string;
      time: string;
      bookingId: string;
      sessionId?: string;
      browserResult?: string;
    }>();

  const [state, setState] = useState<PaymentState>('checking');

  // Poll Stripe session status (max 2 attempts ~1.2s apart) so the user sees
  // a real result instead of a fake spinner.
  useEffect(() => {
    let cancelled = false;

    async function pollOnce(): Promise<'paid' | 'pending' | 'failed' | null> {
      if (!sessionId) return null;
      try {
        const res = await api.get<{
          success: boolean;
          data?: { paymentStatus: string; status: string };
        }>(`/api/v1/payments/session/${sessionId}`);

        if (!res.success || !res.data) return null;
        const ps = res.data.paymentStatus;
        const s = res.data.status;
        if (ps === 'paid' || ps === 'no_payment_required') return 'paid';
        if (s === 'expired') return 'failed';
        return 'pending';
      } catch {
        return null;
      }
    }

    async function run() {
      // If the user cancelled the browser, skip polling and show pending.
      if (browserResult === 'cancel' || browserResult === 'dismiss') {
        if (!cancelled) setState('pending');
        return;
      }

      // First check after 600ms (gives Stripe a tick to settle).
      await new Promise((r) => setTimeout(r, 600));
      if (cancelled) return;
      let result = await pollOnce();
      if (result) {
        if (!cancelled) setState(result);
        return;
      }

      // Retry once after another 1.2s in case the webhook is mid-flight.
      await new Promise((r) => setTimeout(r, 1200));
      if (cancelled) return;
      result = await pollOnce();
      if (!cancelled) setState(result ?? 'pending');
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [sessionId, browserResult]);

  // After we know the state, hand off to the confirmation screen so the user
  // can see their booking. Confirmation handles its own copy for pending vs paid.
  useEffect(() => {
    if (state === 'checking') return;
    const t = setTimeout(() => {
      router.replace({
        pathname: '/checkout/confirmation',
        params: {
          serviceName,
          amount,
          date,
          time,
          bookingId,
          paymentState: state,
        },
      });
    }, 900);
    return () => clearTimeout(t);
  }, [state]);

  const renderBody = () => {
    if (state === 'checking') {
      return (
        <>
          <View style={styles.iconCircle}>
            <ActivityIndicator size="large" color={colors.text.inverse} />
          </View>
          <Text style={styles.heading}>Confirming payment</Text>
          <Text style={styles.subtext}>Checking with Stripe…</Text>
        </>
      );
    }
    if (state === 'paid') {
      return (
        <>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={56} color={colors.text.inverse} />
          </View>
          <Text style={styles.heading}>Payment received!</Text>
          <Text style={styles.subtext}>
            Your booking is confirmed — the vendor has been notified.
          </Text>
        </>
      );
    }
    if (state === 'failed') {
      return (
        <>
          <View style={styles.failedCircle}>
            <Ionicons name="close" size={56} color={colors.text.inverse} />
          </View>
          <Text style={styles.heading}>Payment didn't go through</Text>
          <Text style={styles.subtext}>
            Your booking is saved as pending. You can retry payment from the
            Bookings tab.
          </Text>
        </>
      );
    }
    // pending
    return (
      <>
        <View style={styles.pendingCircle}>
          <Ionicons name="time-outline" size={56} color={colors.text.inverse} />
        </View>
        <Text style={styles.heading}>Booking saved</Text>
        <Text style={styles.subtext}>
          Payment is still confirming. We'll update your booking status as soon
          as Stripe replies.
        </Text>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderBody()}</View>
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
  failedCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  pendingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F59E0B',
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
