import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { useBookingStore } from '../../src/store/bookingStore';

const MOCK_BOOKINGS: Record<string, any> = {
  'mock-1': {
    id: 'mock-1',
    status: 'ACCEPTED',
    category: 'Deep House Cleaning',
    scheduledDate: '2024-12-05',
    scheduledTime: '10:00 AM',
    pointsEarned: 150,
    vendor: { businessName: 'Sparkle Clean Co.' },
    address: { label: 'Home', street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'New York' },
  },
  'mock-2': {
    id: 'mock-2',
    status: 'IN_PROGRESS',
    category: 'Office Cleaning',
    scheduledDate: '2024-12-03',
    scheduledTime: '9:00 AM',
    pointsEarned: null,
    vendor: { businessName: 'ProClean Services' },
    address: { label: 'Work', street: '456 Business Ave', city: 'Brooklyn', state: 'NY', zipCode: '11201', country: 'New York' },
  },
  'mock-3': {
    id: 'mock-3',
    status: 'ACCEPTED',
    category: 'Plumbing Repair',
    scheduledDate: '2024-12-07',
    scheduledTime: '2:00 PM',
    pointsEarned: null,
    pointsRedeemed: 500,
    vendor: { businessName: 'HandyFix Pro' },
    address: { label: 'Home', street: '789 Oak Street', city: 'Manhattan', state: 'NY', zipCode: '10002', country: 'New York' },
  },
};

const TIMELINE_STEPS = [
  {
    id: 'ACCEPTED',
    label: 'Accepted',
    description: 'Your booking has been confirmed',
    timestamp: 'Just now',
  },
  {
    id: 'IN_PROGRESS',
    label: 'In Progress',
    description: 'Service provider is working on your request',
    timestamp: '',
  },
  {
    id: 'COMPLETED',
    label: 'Completed',
    description: 'Service has been completed',
    timestamp: '',
  },
];

const STATUS_ORDER = ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentBooking, isLoading, fetchBooking } = useBookingStore();
  const [demoStatus, setDemoStatus] = useState<string>('ACCEPTED');

  useEffect(() => {
    if (id) fetchBooking(id);
  }, [id]);

  // Use real booking, or mock data fallback
  const booking = currentBooking || MOCK_BOOKINGS[id as string] || null;

  useEffect(() => {
    if (booking?.status) setDemoStatus(booking.status);
  }, [booking?.status]);

  if (isLoading && !booking) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Order Status" showBack />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Order Status" showBack />
        <View style={styles.centered}>
          <Ionicons name="document-text-outline" size={48} color={colors.text.muted} />
          <Text style={styles.emptyText}>Booking not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(demoStatus);
  const pointsEarned = booking.pointsEarned;
  const pointsRedeemed = booking.pointsRedeemed;
  const serviceName = booking.listing?.title || booking.category || 'Service';
  const vendorName = booking.vendor?.businessName || booking.Vendor?.businessName || 'Provider';
  const addr = booking.address || booking.Address;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Order Status" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Card */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceIcon}>
            <Ionicons name="sparkles" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{serviceName}</Text>
            <Text style={styles.vendorName}>{vendorName}</Text>
            {pointsEarned != null && pointsEarned > 0 && (
              <View style={styles.ptsBadge}>
                <Text style={styles.ptsBadgeText}>+{pointsEarned} pts earned</Text>
              </View>
            )}
            {pointsRedeemed != null && pointsRedeemed > 0 && (
              <View style={[styles.ptsBadge, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.ptsBadgeText, { color: '#D97706' }]}>-{pointsRedeemed} pts redeemed</Text>
              </View>
            )}
          </View>
        </View>

        {/* Order Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Timeline</Text>
          <View style={styles.timeline}>
            {TIMELINE_STEPS.map((step, index) => {
              const isActive = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const isLast = index === TIMELINE_STEPS.length - 1;
              return (
                <View key={step.id} style={styles.timelineRow}>
                  {/* Icon + Line */}
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, isActive && styles.timelineDotActive]}>
                      {isActive ? (
                        <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                      ) : (
                        <View style={styles.timelineDotInner} />
                      )}
                    </View>
                    {!isLast && (
                      <View style={[styles.timelineLine, index < currentStatusIndex && styles.timelineLineActive]} />
                    )}
                  </View>
                  {/* Content */}
                  <View style={styles.timelineContent}>
                    <Text style={[styles.timelineLabel, isActive && styles.timelineLabelActive]}>
                      {step.label}
                    </Text>
                    <Text style={styles.timelineDesc}>{step.description}</Text>
                    {isCurrent && step.timestamp ? (
                      <Text style={styles.timelineTime}>{step.timestamp}</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Service Details</Text>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Scheduled Date &amp; Time</Text>
              <Text style={styles.detailValue}>
                {booking.scheduledDate} at {booking.scheduledTime || 'TBD'}
              </Text>
            </View>
          </View>

          {addr && (
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="location-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Service Address</Text>
                <Text style={styles.detailValueBold}>{addr.label}</Text>
                <Text style={styles.detailValue}>
                  {addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Demo Status Changer */}
        <View style={styles.demoBox}>
          <Text style={styles.demoLabel}>Demo: Change Status</Text>
          <View style={styles.demoButtons}>
            {STATUS_ORDER.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.demoBtn, demoStatus === s && styles.demoBtnActive]}
                onPress={() => {
                  setDemoStatus(s);
                  if (s === 'COMPLETED') {
                    router.push(`/review/${id}?serviceName=${encodeURIComponent(serviceName)}&scheduledDate=${encodeURIComponent(booking.scheduledDate || '')}&scheduledTime=${encodeURIComponent(booking.scheduledTime || '')}` as any);
                  }
                }}
              >
                <Text style={[styles.demoBtnText, demoStatus === s && styles.demoBtnTextActive]}>
                  {s === 'ACCEPTED' ? 'Accepted' : s === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
    gap: spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },

  // Service Card
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.08)',
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
    gap: 4,
  },
  serviceName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  vendorName: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  ptsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F59E0B',
    borderRadius: borderRadius.full,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    marginTop: 4,
  },
  ptsBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Timeline
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.08)',
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 36,
  },
  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.border.light,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timelineDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border.light,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 32,
    backgroundColor: colors.border.light,
    marginVertical: 2,
  },
  timelineLineActive: {
    backgroundColor: colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacing.lg,
    paddingTop: 4,
  },
  timelineLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.muted,
  },
  timelineLabelActive: {
    color: colors.text.primary,
  },
  timelineDesc: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  timelineTime: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginTop: 2,
  },

  // Service Details Card
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.08)',
  },
  detailItem: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  detailValueBold: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.primary,
  },

  // Demo Box
  demoBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: spacing.sm,
  },
  demoLabel: {
    fontSize: fontSize.sm,
    color: '#D97706',
    fontWeight: '500',
  },
  demoButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  demoBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  demoBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  demoBtnText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  demoBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
