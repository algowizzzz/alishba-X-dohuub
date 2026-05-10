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
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button, Input } from '../../src/components/ui';
import { useBookingStore } from '../../src/store/bookingStore';

/**
 * Payment screen matching wireframe:
 * - Order summary
 * - Payment method selection
 * - Card input fields (Stripe integration placeholder)
 * - Pay Now button
 */
export default function PaymentScreen() {
  const { serviceName, amount, date, time, notes, vendorId, category, listingId, serviceFee: serviceFeeParam } = useLocalSearchParams<{
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple'>('card');
  const [cardNumber, setCardNumber] = useState('213789217398');
  const [expiry, setExpiry] = useState('11/33');
  const [cvc, setCvc] = useState('••');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = parseInt(amount || '0');
  const serviceFee = parseInt(serviceFeeParam || '10');
  const totalAmount = subtotal + serviceFee;

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
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
      setIsProcessing(false);
      router.replace({
        pathname: '/checkout/processing',
        params: {
          serviceName,
          amount: totalAmount.toString(),
          date,
          time,
          bookingId: booking.id,
        },
      });
    } catch (err: any) {
      setIsProcessing(false);
      Alert.alert(
        'Booking failed',
        err?.response?.data?.error || err?.message || 'Could not create the booking. Please try again.'
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

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <Ionicons
              name="card"
              size={24}
              color={paymentMethod === 'card' ? colors.text.primary : colors.text.secondary}
            />
            <Text
              style={[
                styles.paymentOptionText,
                paymentMethod === 'card' && styles.paymentOptionTextActive,
              ]}
            >
              Credit / Debit Card
            </Text>
            <View style={styles.radioOuter}>
              {paymentMethod === 'card' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'apple' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('apple')}
          >
            <Ionicons
              name="logo-apple"
              size={24}
              color={paymentMethod === 'apple' ? colors.text.primary : colors.text.secondary}
            />
            <Text
              style={[
                styles.paymentOptionText,
                paymentMethod === 'apple' && styles.paymentOptionTextActive,
              ]}
            >
              Apple Pay
            </Text>
            <View style={styles.radioOuter}>
              {paymentMethod === 'apple' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Card Details */}
        {paymentMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            <Input
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="number-pad"
              maxLength={19}
            />
            <View style={styles.cardRow}>
              <View style={styles.halfInput}>
                <Input
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={setExpiry}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  placeholder="CVC"
                  value={cvc}
                  onChangeText={setCvc}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        )}

        {/* Secure Payment Notice */}
        <View style={styles.secureNotice}>
          <Ionicons name="lock-closed" size={16} color={colors.text.secondary} />
          <Text style={styles.secureText}>
            Your payment is secured by Stripe. We never store your card details.
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button
          title={`Pay $${totalAmount}`}
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
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  paymentOptionActive: {
    borderColor: colors.primary,
  },
  paymentOptionText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  paymentOptionTextActive: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.text.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  secureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.md,
  },
  secureText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
});

