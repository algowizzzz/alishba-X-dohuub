import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button } from '../../src/components/ui';
import { useBookingStore } from '../../src/store/bookingStore';
import api from '../../src/services/api';

/**
 * Payment screen — real Stripe Checkout flow.
 *
 * 1. Create the booking on our API.
 * 2. Ask our API for a Stripe Checkout Session URL.
 * 3. Open the hosted Checkout page in a system browser session.
 * 4. When Stripe redirects back to dohuub://checkout/return (or the user
 *    closes the browser), navigate to the processing screen which polls for
 *    payment status.
 *
 * No card form on this screen — Stripe owns the card UI for PCI compliance.
 */
export default function PaymentScreen() {
  const {
    serviceName,
    amount,
    date,
    time,
    notes,
    vendorId,
    category,
    listingId,
    serviceFee: serviceFeeParam,
  } = useLocalSearchParams<{
    serviceName: string;
    amount: string;
    date: string;
    time: string;
    notes?: string;
    vendorId?: string;
    category?: string;
    listingId?: string;
    serviceFee?: string;
  }>();

  const createBooking = useBookingStore((s) => s.createBooking);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = parseInt(amount || '0');
  const serviceFee = parseInt(serviceFeeParam || '10');
  const totalAmount = subtotal + serviceFee;

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      // 1. Create the booking (server is the source of truth for fees/totals).
      const booking = await createBooking({
        vendorId: vendorId || '',
        category: category || 'CLEANING',
        listingId: listingId || null,
        serviceName,
        scheduledDate: date,
        scheduledTime: time,
        specialInstructions: notes || null,
        subtotal,
        serviceFee,
        total: totalAmount,
      });

      // 2. Ask the API for a Stripe Checkout Session URL.
      const sessionRes = await api.post<{
        success: boolean;
        data?: { url: string; sessionId: string };
        error?: string;
      }>('/api/v1/payments/checkout-session', { bookingId: booking.id });

      if (!sessionRes.success || !sessionRes.data?.url) {
        throw new Error(
          sessionRes.error ||
            'Could not start the payment session. Your booking is saved as pending — you can pay later from Bookings.'
        );
      }

      const { url, sessionId } = sessionRes.data;

      // 3. Open Stripe Checkout. openAuthSessionAsync intercepts our deep
      // link return scheme on iOS/Android. In Expo Go, the scheme isn't
      // registered, so the user just closes the in-app browser when done —
      // we still navigate to /checkout/processing after the browser closes.
      const result = await WebBrowser.openAuthSessionAsync(
        url,
        'dohuub://checkout/return'
      );

      // Regardless of how the browser closes (success/cancel/dismiss),
      // hand off to the processing screen which polls the session status.
      // The webhook is the source of truth, but the poll gives the user
      // immediate feedback.
      setIsProcessing(false);
      router.replace({
        pathname: '/checkout/processing',
        params: {
          serviceName: serviceName || '',
          amount: totalAmount.toString(),
          date: date || '',
          time: time || '',
          bookingId: booking.id,
          sessionId,
          // result.type can be 'success' (deep link hit), 'cancel' (user back),
          // or 'dismiss' (closed sheet). We pass it through so processing can
          // show a sensible message.
          browserResult: result.type,
        },
      });
    } catch (err: any) {
      setIsProcessing(false);
      Alert.alert(
        'Payment could not be started',
        err?.response?.data?.error || err?.message || 'Please try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Payment" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{serviceName}</Text>
              <Text style={styles.summaryValue}>${amount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{date}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{time}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryValue}>${serviceFee}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalAmount}</Text>
            </View>
          </View>
        </View>

        {/* Hosted-checkout notice */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <View style={styles.paymentOption}>
            <Ionicons name="card" size={24} color={colors.text.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentOptionText}>Credit / Debit Card</Text>
              <Text style={styles.paymentOptionSubtext}>
                Securely handled by Stripe
              </Text>
            </View>
            <Ionicons name="lock-closed" size={18} color={colors.text.muted} />
          </View>
        </View>

        <View style={styles.infoNotice}>
          <Ionicons name="information-circle" size={18} color="#1E5DB0" />
          <Text style={styles.infoText}>
            You'll be redirected to Stripe to complete payment. After you finish,
            you'll come right back to the app.
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button
          title={`Pay $${totalAmount} with Card`}
          onPress={handlePayNow}
          loading={isProcessing}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summaryCard: {
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  totalRow: {
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  totalLabel: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  paymentOptionText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    fontWeight: '500',
  },
  paymentOptionSubtext: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  infoNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.08)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.25)',
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: '#1E5DB0',
    lineHeight: 18,
    fontWeight: '500',
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
});
