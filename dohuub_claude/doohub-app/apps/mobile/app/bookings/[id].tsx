import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Platform, StatusBar, Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../../src/store/bookingStore';

const TIMELINE_STEPS = [
  { id: 'ACCEPTED', label: 'Accepted', description: 'Your booking has been confirmed', timestamp: 'Just now' },
  { id: 'IN_PROGRESS', label: 'In Progress', description: 'Service provider is working on your request', timestamp: '' },
  { id: 'COMPLETED', label: 'Completed', description: 'Service has been completed', timestamp: '' },
];

const STATUS_ORDER = ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];

/**
 * Booking Detail / Order Status — matching boss wireframe (OrderTrackingScreen.tsx):
 * - Glassmorphic header with "Order Status"
 * - Service card with blue gradient icon + name + vendor + points badges
 * - Order Timeline with green checkmarks, blue spinner, gray circles
 * - Service Details with calendar + map icons
 * - Demo status changer (amber card)
 */
export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentBooking, isLoading, fetchBooking, completeBooking } = useBookingStore();
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (id) fetchBooking(id);
  }, [id]);

  const booking = currentBooking;

  if (isLoading || !booking) {
    return (
      <SafeAreaView style={s.container}>
        <Header />
        {isLoading ? (
          <View style={s.centered}><ActivityIndicator size="large" color="#2E7AD9" /></View>
        ) : (
          <View style={s.centered}>
            <Ionicons name="document-text-outline" size={56} color="#94A3B8" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginTop: 16 }}>Booking not found</Text>
            <Text style={{ fontSize: 13, color: '#64748B', marginTop: 6, textAlign: 'center', paddingHorizontal: 32 }}>We couldn't locate this booking. It may have been removed or the link is invalid.</Text>
            <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, backgroundColor: '#2E7AD9', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(booking.status);
  const serviceName = booking.listing?.title || booking.category || 'Service';
  const vendorName = booking.vendor?.businessName || booking.Vendor?.businessName || 'Provider';
  const addr = booking.address || booking.Address;
  const isPowered = booking.vendor?.isMichelle || false;
  const pointsEarned = booking.pointsEarned;
  const pointsRedeemed = booking.pointsRedeemed;

  return (
    <SafeAreaView style={s.container}>
      <Header />

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Service Card */}
        <View style={s.serviceCard}>
          <View style={s.serviceRow}>
            <View style={s.serviceIcon}>
              <Ionicons name="sparkles" size={28} color="#FFFFFF" />
            </View>
            <View style={s.serviceInfo}>
              <Text style={s.serviceName}>{serviceName}</Text>
              <Text style={s.vendorName}>{vendorName}</Text>
              {isPowered && (
                <View style={s.poweredBadge}>
                  <Text style={s.poweredText}>Powered by DoHuub</Text>
                </View>
              )}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {pointsEarned != null && pointsEarned > 0 && (
                  <View style={s.ptsBadgeEarned}>
                    <Text style={s.ptsBadgeEarnedText}>+{pointsEarned} pts earned</Text>
                  </View>
                )}
                {pointsRedeemed != null && pointsRedeemed > 0 && (
                  <View style={s.ptsBadgeRedeemed}>
                    <Text style={s.ptsBadgeRedeemedText}>-{pointsRedeemed} pts redeemed</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Order Timeline */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Order Timeline</Text>
          {TIMELINE_STEPS.map((step, index) => {
            const isCompleted = index < currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const isActive = index <= currentStatusIndex;
            const isLast = index === TIMELINE_STEPS.length - 1;

            return (
              <View key={step.id} style={s.timelineRow}>
                <View style={s.timelineLeft}>
                  {/* Dot */}
                  {isCompleted ? (
                    <View style={s.dotCompleted}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  ) : isCurrent ? (
                    <View style={s.dotCurrent}>
                      <Ionicons name="ellipse" size={12} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={s.dotPending}>
                      <View style={s.dotPendingInner} />
                    </View>
                  )}
                  {/* Line */}
                  {!isLast && (
                    <View style={[s.timelineLine, isCompleted && s.timelineLineActive]} />
                  )}
                </View>

                <View style={s.timelineContent}>
                  <Text style={[s.timelineLabel, !isActive && { opacity: 0.5 }]}>{step.label}</Text>
                  <Text style={[s.timelineDesc, !isActive && { opacity: 0.5 }]}>{step.description}</Text>
                  {isCurrent && step.timestamp ? (
                    <Text style={s.timelineTime}>{step.timestamp}</Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        {/* Service Details */}
        <View style={s.detailsCard}>
          <Text style={s.sectionTitle}>Service Details</Text>

          <View style={s.detailItem}>
            <Ionicons name="calendar-outline" size={20} color="#2E7AD9" style={{ marginTop: 2 }} />
            <View>
              <Text style={s.detailLabel}>Scheduled Date & Time</Text>
              <Text style={s.detailValue}>{booking.scheduledDate} at {booking.scheduledTime || 'TBD'}</Text>
            </View>
          </View>

          {addr && (
            <View style={s.detailItem}>
              <Ionicons name="location-outline" size={20} color="#2E7AD9" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={s.detailLabel}>Service Address</Text>
                <Text style={s.detailValueBold}>{addr.label}</Text>
                <Text style={s.detailValue}>{addr.street}, {addr.city}, {addr.state}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Actions */}
        {(booking.status === 'ACCEPTED' || booking.status === 'IN_PROGRESS') && (
          <TouchableOpacity
            style={[s.completeBtn, completing && { opacity: 0.5 }]}
            disabled={completing}
            onPress={async () => {
              if (!id || completing) return;
              setCompleting(true);
              try {
                const result = await completeBooking(id as string);
                Alert.alert(
                  'Service Completed',
                  result.pointsEarned > 0
                    ? `You earned ${result.pointsEarned} points!`
                    : 'Booking marked complete.',
                  [{
                    text: 'Leave Review',
                    onPress: () => router.push(`/review/${id}?serviceName=${encodeURIComponent(serviceName)}&scheduledDate=${encodeURIComponent(booking.scheduledDate || '')}&scheduledTime=${encodeURIComponent(booking.scheduledTime || '')}` as any),
                  }, { text: 'Later', style: 'cancel' }]
                );
              } catch (e: any) {
                Alert.alert('Error', e?.message || 'Could not complete booking');
              } finally {
                setCompleting(false);
              }
            }}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            <Text style={s.completeBtnText}>
              {completing ? 'Completing…' : 'Mark Service as Complete'}
            </Text>
          </TouchableOpacity>
        )}
        {booking.status === 'COMPLETED' && (
          <>
            <TouchableOpacity
              style={s.completeBtn}
              onPress={() => router.push(`/review/${id}?serviceName=${encodeURIComponent(serviceName)}&scheduledDate=${encodeURIComponent(booking.scheduledDate || '')}&scheduledTime=${encodeURIComponent(booking.scheduledTime || '')}` as any)}
            >
              <Ionicons name="star" size={20} color="#FFF" />
              <Text style={s.completeBtnText}>Leave a Review</Text>
            </TouchableOpacity>

            {/* Re-order CTA — routes the user back to the same vendor's booking
                flow for the same category. Vendor + category are enough to
                reach the right book screen; price + slots are re-fetched. */}
            <TouchableOpacity
              style={[s.completeBtn, { backgroundColor: '#1A1A2E', marginTop: 8 }]}
              onPress={() => {
                const vendorId = booking.vendorId || booking.vendor?.id;
                if (!vendorId) {
                  Alert.alert('Cannot re-book', 'Vendor info is missing for this booking.');
                  return;
                }
                const cat = String(booking.category || '').toUpperCase();
                const path: Record<string, string> = {
                  CLEANING: `/services/cleaning/${vendorId}/book`,
                  HANDYMAN: `/services/handyman/${vendorId}/book`,
                  BEAUTY: `/services/beauty/${vendorId}`,
                  RENTALS: `/services/rentals/${vendorId}`,
                  RIDE_ASSISTANCE: `/services/caregiving/rides/${vendorId}/book`,
                  COMPANIONSHIP: `/services/caregiving/companions/${vendorId}/book`,
                };
                const target = path[cat];
                if (!target) {
                  Alert.alert('Cannot re-book', 'This service type does not support quick re-booking.');
                  return;
                }
                router.push(target as any);
              }}
            >
              <Ionicons name="refresh" size={20} color="#FFF" />
              <Text style={s.completeBtnText}>Book Again</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={s.header}>
      <View style={s.headerInner}>
        <TouchableOpacity style={s.backBtn} onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)/bookings' as any);
        }}>
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Order Status</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F7FF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, gap: 16, paddingBottom: 48 },

  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 16,
    paddingBottom: 24, paddingHorizontal: 24,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 30, elevation: 4,
    borderBottomWidth: 1, borderBottomColor: 'rgba(46, 122, 217, 0.08)',
  },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1E293B' },

  // Service Card
  serviceCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: 'rgba(46, 122, 217, 0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  serviceRow: { flexDirection: 'row', gap: 12 },
  serviceIcon: {
    width: 64, height: 64, borderRadius: 12,
    backgroundColor: '#2E7AD9', justifyContent: 'center', alignItems: 'center',
  },
  serviceInfo: { flex: 1, gap: 2 },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  vendorName: { fontSize: 14, color: '#64748B' },
  poweredBadge: {
    alignSelf: 'flex-start', backgroundColor: '#2E7AD9',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginTop: 4,
  },
  poweredText: { fontSize: 10, fontWeight: '600', color: '#FFFFFF' },
  ptsBadgeEarned: {
    alignSelf: 'flex-start', borderRadius: 12,
    paddingVertical: 3, paddingHorizontal: 10,
    backgroundColor: '#F59E0B',
  },
  ptsBadgeEarnedText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  ptsBadgeRedeemed: {
    alignSelf: 'flex-start', borderRadius: 12,
    paddingVertical: 3, paddingHorizontal: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  ptsBadgeRedeemedText: { fontSize: 12, fontWeight: '600', color: '#16A34A' },

  // Timeline section
  section: { gap: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 16 },
  timelineRow: { flexDirection: 'row', gap: 16 },
  timelineLeft: { alignItems: 'center', width: 32 },
  dotCompleted: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center',
  },
  dotCurrent: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#2E7AD9', justifyContent: 'center', alignItems: 'center',
  },
  dotPending: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E8F1FC', borderWidth: 2, borderColor: 'rgba(46, 122, 217, 0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  dotPendingInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#CBD5E1' },
  timelineLine: {
    width: 2, flex: 1, minHeight: 40,
    backgroundColor: '#E8F1FC', marginVertical: 4,
  },
  timelineLineActive: { backgroundColor: '#22C55E' },
  timelineContent: { flex: 1, paddingBottom: 24, paddingTop: 4 },
  timelineLabel: { fontSize: 15, fontWeight: '500', color: '#1E293B' },
  timelineDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },
  timelineTime: { fontSize: 13, color: '#2E7AD9', marginTop: 4 },

  // Details Card
  detailsCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: 'rgba(46, 122, 217, 0.1)',
    gap: 16,
  },
  detailItem: { flexDirection: 'row', gap: 12 },
  detailLabel: { fontSize: 13, color: '#64748B', marginBottom: 2 },
  detailValue: { fontSize: 14, color: '#1E293B' },
  detailValueBold: { fontSize: 14, fontWeight: '600', color: '#1E293B' },

  // Demo Box
  completeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#2E7AD9', borderRadius: 12, paddingVertical: 16,
    marginTop: 8, shadowColor: '#2E7AD9', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
  },
  completeBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
