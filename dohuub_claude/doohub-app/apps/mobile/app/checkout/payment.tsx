import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button } from '../../src/components/ui';
import { useBookingStore } from '../../src/store/bookingStore';
import api from '../../src/services/api';

type Provider = 'STRIPE' | 'WIPAY' | 'POWERTRANZ';

WebBrowser.maybeCompleteAuthSession();

/**
 * User payment screen.
 *
 * 1. Create booking
 * 2. Pick an enabled provider (recommended from API, else first enabled)
 * 3. Open hosted checkout (Stripe / WiPay / PowerTranz)
 * 4. Hand off to /checkout/processing
 *
 * If no gateway is configured, uses POST /payments/demo-complete so the
 * booking still settles and confirmation still works.
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
  const [providerLabel, setProviderLabel] = useState('Card payment');
  const [demoMode, setDemoMode] = useState(false);

  const subtotal = parseInt(amount || '0', 10) || 0;
  const serviceFee = parseInt(serviceFeeParam || '10', 10) || 10;
  const totalAmount = subtotal + serviceFee;

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{
          success: boolean;
          data?: {
            recommended: Provider;
            available: { id: Provider; enabled: boolean }[];
            demoAllowed?: boolean;
            anyEnabled?: boolean;
          };
        }>('/payments/providers');
        const data = res.data;
        if (!data) return;
        const enabled = (data.available || []).filter((p) => p.enabled);
        setDemoMode(enabled.length === 0);
        const pick =
          enabled.find((p) => p.id === data.recommended)?.id || enabled[0]?.id;
        if (pick === 'STRIPE') setProviderLabel('Credit / Debit Card (Stripe)');
        else if (pick === 'WIPAY') setProviderLabel('Card (WiPay)');
        else if (pick === 'POWERTRANZ') setProviderLabel('Card (PowerTranz)');
        else setProviderLabel('Demo payment (no gateway configured)');
      } catch {
        setDemoMode(true);
        setProviderLabel('Demo payment (offline)');
      }
    })();
  }, []);

  const goConfirmation = (bookingId: string, paymentState: string = 'paid') => {
    router.replace({
      pathname: '/checkout/confirmation',
      params: {
        serviceName: serviceName || '',
        amount: totalAmount.toString(),
        date: date || '',
        time: time || '',
        bookingId,
        category: category || 'CLEANING',
        paymentState,
      },
    });
  };

  const completeDemo = async (bookingId: string) => {
    try {
      await api.post('/payments/demo-complete', { bookingId });
    } catch {
      // Booking still exists; confirmation is still useful.
    }
    goConfirmation(bookingId, 'paid');
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    let bookingId: string | null = null;
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
      bookingId = booking.id;

      // Resolve provider
      let provider: Provider | null = null;
      try {
        const res = await api.get<{
          success: boolean;
          data?: {
            recommended: Provider;
            available: { id: Provider; enabled: boolean }[];
            anyEnabled?: boolean;
          };
        }>('/payments/providers');
        const enabled = (res.data?.available || []).filter((p) => p.enabled);
        provider =
          enabled.find((p) => p.id === res.data?.recommended)?.id ||
          enabled[0]?.id ||
          null;
      } catch {
        provider = null;
      }

      if (!provider) {
        await completeDemo(booking.id);
        return;
      }

      let sessionRes: {
        success: boolean;
        data?: { url: string; sessionId: string; provider: Provider };
        error?: string;
      };
      try {
        sessionRes = await api.post('/payments/checkout-session', {
          provider,
          bookingId: booking.id,
        });
      } catch (e: any) {
        const errMsg = e?.response?.data?.error || e?.message || '';
        if (
          String(errMsg).includes('not configured') ||
          e?.response?.status === 503
        ) {
          await completeDemo(booking.id);
          return;
        }
        throw e;
      }

      if (!sessionRes.success || !sessionRes.data?.url) {
        await completeDemo(booking.id);
        return;
      }

      const { url, sessionId } = sessionRes.data;

      const result = await WebBrowser.openAuthSessionAsync(
        url,
        'dohuub://checkout/return'
      );

      let resolvedSessionId = sessionId;
      if (result.type === 'success' && 'url' in result && result.url) {
        try {
          const matched = String(result.url).match(/[?&]session=([^&]+)/);
          if (matched?.[1]) resolvedSessionId = decodeURIComponent(matched[1]);
        } catch {
          /* keep sessionId */
        }
      }

      router.replace({
        pathname: '/checkout/processing',
        params: {
          serviceName: serviceName || '',
          amount: totalAmount.toString(),
          date: date || '',
          time: time || '',
          bookingId: booking.id,
          sessionId: resolvedSessionId,
          browserResult: result.type,
          category: category || 'CLEANING',
        },
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.message || 'Please try again.';
      if (bookingId && (String(msg).includes('not configured') || String(msg).includes('provider must'))) {
        await completeDemo(bookingId);
        return;
      }
      Alert.alert('Payment could not be started', msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScreenHeader title="Payment" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOption}>
            <Ionicons name="card" size={24} color={colors.text.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentOptionText}>{providerLabel}</Text>
              <Text style={styles.paymentOptionSubtext}>
                {demoMode
                  ? 'No live gateway configured — booking will be confirmed in demo mode'
                  : 'Secure hosted checkout'}
              </Text>
            </View>
            <Ionicons
              name={demoMode ? 'checkmark-circle' : 'lock-closed'}
              size={18}
              color={demoMode ? '#22C55E' : colors.text.muted}
            />
          </View>
        </View>

        <View style={styles.infoNotice}>
          <Ionicons name="information-circle" size={18} color="#1E5DB0" />
          <Text style={styles.infoText}>
            {demoMode
              ? 'Tap Pay to create and confirm your booking. Connect Stripe (or WiPay) on the API to enable real card charges.'
              : 'You will be redirected to a secure checkout page. After paying, you will return to the app automatically.'}
          </Text>
        </View>
      </ScrollView>

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
