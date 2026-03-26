import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader } from '../../../src/components/composite';
import { getBookingById, getBookingStatusHistory } from '../../../src/lib/queries';

const STATUS_STEPS = [
  { id: 'confirmed', label: 'Booking Confirmed', icon: 'checkmark-circle' },
  { id: 'in_progress', label: 'Service In Progress', icon: 'construct' },
  { id: 'completed', label: 'Completed', icon: 'checkmark-done-circle' },
];

function formatDateTime(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    if (timeStr) {
      return `${formattedDate} at ${timeStr}`;
    }
    return formattedDate;
  } catch {
    return dateStr || '';
  }
}

function formatAddress(address: any): string {
  if (!address) return '';
  const parts = [address.street, address.city, address.state, address.zipCode].filter(Boolean);
  return parts.join(', ');
}

function formatHistoryTime(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return createdAt;
  }
}

interface BookingDisplay {
  id: string;
  status: string;
  serviceType: string;
  provider: {
    name: string;
    assignedPerson: string;
    phone: string;
    rating: number;
  };
  scheduledTime: string;
  address: string;
  estimatedArrival: string;
  total: number;
  statusHistory: Array<{ status: string; time: string }>;
}

/**
 * Generic Booking Tracking Screen matching wireframe:
 * - Booking ID
 * - Status timeline with timestamps
 * - Provider info with contact
 * - Service details
 * - Estimated arrival
 */
export default function BookingTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDisplay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      try {
        if (!id) return;

        const [bookingData, historyData] = await Promise.all([
          getBookingById(id),
          getBookingStatusHistory(id),
        ]);

        if (!bookingData) return;

        const statusHistory = historyData.map((h: any) => ({
          status: (h.status || '').toLowerCase(),
          time: formatHistoryTime(h.createdAt),
        }));

        setBooking({
          id: bookingData.id.substring(0, 8).toUpperCase(),
          status: (bookingData.status || '').toLowerCase(),
          serviceType: bookingData.category || 'Service',
          provider: {
            name: bookingData.Vendor?.businessName || 'Provider',
            assignedPerson: '',
            phone: bookingData.Vendor?.contactPhone || '',
            rating: bookingData.Vendor?.rating ?? 0,
          },
          scheduledTime: formatDateTime(bookingData.scheduledDate, bookingData.scheduledTime),
          address: formatAddress(bookingData.Address),
          estimatedArrival: bookingData.scheduledTime || '',
          total: bookingData.total ?? 0,
          statusHistory,
        });
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Order Status" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Order Status" showBack />
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.text.muted} />
          <Text style={styles.errorText}>Booking not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Map granular statuses to the 3-step model
  const statusMap: Record<string, string> = {
    confirmed: 'confirmed',
    provider_assigned: 'confirmed',
    en_route: 'in_progress',
    arrived: 'in_progress',
    in_progress: 'in_progress',
    completed: 'completed',
  };
  const mappedStatus = statusMap[booking.status] || booking.status;
  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.id === mappedStatus);

  const handleContactProvider = () => {
    if (booking.provider?.phone) {
      Linking.openURL(`tel:${booking.provider.phone}`);
    }
  };

  const handleMessageProvider = () => {
    if (booking.provider?.phone) {
      Linking.openURL(`sms:${booking.provider.phone}`);
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@dohuub.com?subject=Booking%20Support');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Order Status" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking ID */}
        <View style={styles.bookingIdContainer}>
          <Text style={styles.bookingIdLabel}>Booking ID</Text>
          <Text style={styles.bookingId}>{booking.id}</Text>
        </View>

        {/* Estimated Arrival Banner */}
        {booking.status !== 'completed' && booking.status !== 'in_progress' && (
          <View style={styles.arrivalBanner}>
            <Text style={styles.arrivalLabel}>Estimated Arrival</Text>
            <Text style={styles.arrivalTime}>{booking.estimatedArrival}</Text>
          </View>
        )}

        {/* In Progress Banner */}
        {booking.status === 'in_progress' && (
          <View style={[styles.arrivalBanner, styles.inProgressBanner]}>
            <Ionicons name="construct" size={24} color={colors.text.inverse} />
            <Text style={styles.arrivalTime}>Service In Progress</Text>
          </View>
        )}

        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.timeline}>
            {STATUS_STEPS.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const historyItem = booking.statusHistory.find(h => h.status === status.id);

              return (
                <View key={status.id} style={styles.timelineItem}>
                  <View style={styles.timelineIconContainer}>
                    <View
                      style={[
                        styles.timelineIcon,
                        isCompleted && styles.timelineIconCompleted,
                        isCurrent && styles.timelineIconCurrent,
                      ]}
                    >
                      <Ionicons
                        name={status.icon as any}
                        size={18}
                        color={isCompleted ? colors.text.inverse : colors.text.muted}
                      />
                    </View>
                    {index < STATUS_STEPS.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          isCompleted && index < currentStatusIndex && styles.timelineLineCompleted,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineLabel,
                        isCompleted && styles.timelineLabelCompleted,
                        isCurrent && styles.timelineLabelCurrent,
                      ]}
                    >
                      {status.label}
                    </Text>
                    {historyItem && (
                      <Text style={styles.timelineTime}>{historyItem.time}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Provider Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Provider</Text>
          <View style={styles.providerCard}>
            <View style={styles.providerAvatar}>
              <Ionicons name="person" size={24} color={colors.text.muted} />
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerCompany}>{booking.provider.name}</Text>
              <Text style={styles.providerPerson}>{booking.provider.assignedPerson}</Text>
              <Text style={styles.providerRating}>⭐ {booking.provider.rating}</Text>
            </View>
            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.contactButton} onPress={handleContactProvider}>
                <Ionicons name="call" size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton} onPress={handleMessageProvider}>
                <Ionicons name="chatbubble" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="sparkles-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.detailLabel}>Service:</Text>
              <Text style={styles.detailValue}>{booking.serviceType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.detailLabel}>Scheduled:</Text>
              <Text style={styles.detailValue}>{booking.scheduledTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.detailLabel}>Address:</Text>
              <Text style={styles.detailValue}>{booking.address}</Text>
            </View>
            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${booking.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Support */}
        <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
          <Ionicons name="help-circle-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.supportText}>Need help with your booking?</Text>
        </TouchableOpacity>

        {/* Completed Actions */}
        {booking.status === 'completed' && (
          <View style={styles.completedActions}>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => Alert.alert('Invoice', 'Invoice feature coming soon')}
            >
              <Ionicons name="document-text-outline" size={20} color={colors.primary} />
              <Text style={styles.outlineButtonText}>View Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => router.push(`/review/${id}` as any)}
            >
              <Ionicons name="star-outline" size={20} color={colors.primary} />
              <Text style={styles.outlineButtonText}>Leave Review</Text>
            </TouchableOpacity>
          </View>
        )}
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
  },
  bookingIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  bookingIdLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  bookingId: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: 'monospace',
  },
  arrivalBanner: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  inProgressBanner: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  arrivalLabel: {
    fontSize: fontSize.sm,
    color: colors.border.default,
    marginBottom: spacing.xs,
  },
  arrivalTime: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.inverse,
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
  timeline: {
    paddingLeft: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 50,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: colors.status.success,
  },
  timelineIconCurrent: {
    backgroundColor: colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    marginVertical: spacing.xs,
  },
  timelineLineCompleted: {
    backgroundColor: colors.status.success,
  },
  timelineContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  timelineLabel: {
    fontSize: fontSize.md,
    color: colors.text.muted,
  },
  timelineLabelCompleted: {
    color: colors.text.primary,
  },
  timelineLabelCurrent: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  timelineTime: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  providerInfo: {
    flex: 1,
  },
  providerCompany: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  providerPerson: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  providerRating: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    borderRadius: borderRadius.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  detailLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    width: 70,
  },
  detailValue: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  totalRow: {
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  supportText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  completedActions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  outlineButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },
});

