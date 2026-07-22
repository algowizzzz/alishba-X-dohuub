import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { getBookingById } from '../../src/lib/queries';
import { useAuthStore } from '../../src/store/authStore';

const WHAT_NEXT = [
  'Your order has been automatically accepted',
  'Track your order status in real-time',
  'Rate and review your experience after completion',
];

export default function ConfirmationScreen() {
  const { serviceName, amount, date, time, bookingId, vendorName, category } = useLocalSearchParams<{
    serviceName: string;
    amount: string;
    date: string;
    time: string;
    bookingId: string;
    vendorName?: string;
    category?: string;
  }>();

  const { addresses } = useAuthStore();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultAddress = addresses?.find((a: any) => a.isDefault) || addresses?.[0];

  useEffect(() => {
    if (bookingId && !bookingId.startsWith('dummy-')) {
      setIsLoading(true);
      getBookingById(bookingId)
        .then(setBooking)
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [bookingId]);

  const displayServiceName = booking?.listing?.title || serviceName || 'Cleaning Service';
  const displayVendorName = booking?.Vendor?.businessName || vendorName || 'DoHuub Official Store';
  const displayDate = date
    ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : '';
  const displayTime = booking?.scheduledTime || time || '';
  const displayAmount = booking?.totalPrice?.toFixed(2) || amount || '0';
  const pointsEarned = Math.floor(parseFloat(displayAmount));

  const orderNumber = bookingId && !bookingId.startsWith('dummy-')
    ? `CS${bookingId.replace(/-/g, '').slice(0, 9).toUpperCase()}`
    : `CS${Math.floor(10000000 + Math.random() * 90000000)}`;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Success Icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={44} color="#22C55E" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Order Confirmed</Text>
        <Text style={styles.subtitle}>
          Your {(category || 'cleaning').toLowerCase()} service has been successfully booked
        </Text>

        {/* Points Banner */}
        <View style={styles.pointsBanner}>
          <Ionicons name="gift-outline" size={28} color="#FFFFFF" style={{ marginBottom: 6 }} />
          <Text style={styles.pointsAmount}>+{pointsEarned} Points!</Text>
          <Text style={styles.pointsSubtext}>
            Added to your rewards wallet after service completion
          </Text>
          <TouchableOpacity style={styles.viewRewardsBtn} onPress={() => router.push('/rewards' as any)}>
            <Text style={styles.viewRewardsBtnText}>View My Rewards</Text>
          </TouchableOpacity>
        </View>

        {/* Order Number */}
        <View style={styles.orderNumberCard}>
          <Text style={styles.orderNumberLabel}>Order Number</Text>
          <Text style={styles.orderNumber}>{orderNumber}</Text>
        </View>

        {/* Booking Details */}
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.detailsCard}>
          {/* Service row */}
          <View style={styles.serviceRow}>
            <View style={styles.serviceIconCircle}>
              <Ionicons name="sparkles" size={22} color={colors.primary} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceNameText}>{displayServiceName}</Text>
              <Text style={styles.vendorNameText}>{displayVendorName}</Text>
              <View style={styles.poweredBadge}>
                <Text style={styles.poweredBadgeText}>Powered by DoHuub</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Date */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.detailRowLabel}>Date</Text>
              <Text style={styles.detailRowValue}>{displayDate}</Text>
            </View>
          </View>

          <View style={styles.thinDivider} />

          {/* Time */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Ionicons name="time-outline" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.detailRowLabel}>Time</Text>
              <Text style={styles.detailRowValue}>{displayTime}</Text>
            </View>
          </View>

          {defaultAddress && (
            <>
              <View style={styles.thinDivider} />
              <View style={styles.detailRow}>
                <View style={styles.detailIconBox}>
                  <Ionicons name="location-outline" size={16} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailRowLabel}>Service Address</Text>
                  <Text style={styles.detailRowValue}>{defaultAddress.label || defaultAddress.type}</Text>
                  <Text style={styles.detailRowSub}>
                    {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state} {defaultAddress.zipCode}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Payment & Price */}
        <View style={styles.paymentCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Ionicons name="card-outline" size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailRowLabel}>Payment Method</Text>
              <Text style={styles.detailRowValue}>••••</Text>
            </View>
          </View>
          <View style={styles.thinDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>${displayAmount}</Text>
          </View>
        </View>

        {/* What's Next */}
        <Text style={styles.sectionTitle}>What's Next?</Text>
        <View style={styles.whatsNextCard}>
          {WHAT_NEXT.map((step, i) => (
            <View key={i} style={[styles.stepRow, i < WHAT_NEXT.length - 1 && styles.stepRowBorder]}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Buttons */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => router.replace({ pathname: '/bookings/[id]', params: { id: bookingId || '1' } })}
        >
          <Text style={styles.trackBtnText}>Track Order Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },

  // Success icon
  iconWrapper: { alignItems: 'center', marginBottom: spacing.md },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 3, borderColor: '#22C55E',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.06)',
  },

  title: {
    fontSize: fontSize.xxl, fontWeight: '700',
    color: colors.text.primary, textAlign: 'center', marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm, color: colors.primary,
    textAlign: 'center', marginBottom: spacing.lg,
  },

  // Points banner
  pointsBanner: {
    backgroundColor: '#F59E0B',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  pointsAmount: {
    fontSize: fontSize.xxl, fontWeight: '700', color: '#FFFFFF', marginBottom: spacing.xs,
  },
  pointsSubtext: {
    fontSize: fontSize.sm, color: 'rgba(255,255,255,0.9)',
    textAlign: 'center', lineHeight: 20, marginBottom: spacing.md,
  },
  viewRewardsBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  viewRewardsBtnText: { fontSize: fontSize.md, fontWeight: '600', color: '#FFFFFF' },

  // Order number
  orderNumberCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin, borderColor: 'rgba(46,122,217,0.1)',
    padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg,
  },
  orderNumberLabel: { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: 4 },
  orderNumber: { fontSize: fontSize.md, fontWeight: '600', color: colors.primary },

  sectionTitle: {
    fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md,
  },

  // Details card
  detailsCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin, borderColor: 'rgba(46,122,217,0.08)',
    overflow: 'hidden', marginBottom: spacing.md,
  },
  serviceRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md,
  },
  serviceIconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceNameText: { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary },
  vendorNameText: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  poweredBadge: {
    alignSelf: 'flex-start', marginTop: 4,
    backgroundColor: colors.primary, borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
  },
  poweredBadgeText: { fontSize: 10, fontWeight: '600', color: '#FFFFFF' },

  divider: { height: 1, backgroundColor: 'rgba(46,122,217,0.08)', marginHorizontal: spacing.md },
  thinDivider: { height: 1, backgroundColor: 'rgba(46,122,217,0.06)', marginHorizontal: spacing.md },

  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, padding: spacing.md },
  detailIconBox: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center',
  },
  detailRowLabel: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 2 },
  detailRowValue: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  detailRowSub: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 1 },

  // Payment card
  paymentCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin, borderColor: 'rgba(46,122,217,0.08)',
    overflow: 'hidden', marginBottom: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  priceLabel: { fontSize: fontSize.md, color: colors.text.secondary },
  priceValue: { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary },

  // What's Next
  whatsNextCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin, borderColor: 'rgba(46,122,217,0.08)',
    overflow: 'hidden', marginBottom: spacing.md,
  },
  stepRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md,
  },
  stepRowBorder: {
    borderBottomWidth: borderWidth.thin, borderBottomColor: 'rgba(46,122,217,0.06)',
  },
  stepNumber: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  stepNumberText: { fontSize: fontSize.sm, fontWeight: '700', color: '#FFFFFF' },
  stepText: { flex: 1, fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20 },

  // CTA
  ctaContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.lg, paddingBottom: 28,
    backgroundColor: colors.background,
    borderTopWidth: borderWidth.thin, borderTopColor: 'rgba(46,122,217,0.08)',
    gap: spacing.sm,
  },
  trackBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.lg,
    paddingVertical: spacing.md, alignItems: 'center',
  },
  trackBtnText: { fontSize: fontSize.md, fontWeight: '600', color: '#FFFFFF' },
  homeBtn: { borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  homeBtnText: { fontSize: fontSize.md, fontWeight: '500', color: colors.text.primary },
});
