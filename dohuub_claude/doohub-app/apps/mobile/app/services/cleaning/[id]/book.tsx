import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { getCleaningListings, getVendorById } from '../../../../src/lib/queries';
import { useAuthStore } from '../../../../src/store/authStore';

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addresses } = useAuthStore();

  const [listing, setListing] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');

  const defaultAddress = addresses?.find((a: any) => a.isDefault) || addresses?.[0];

  useEffect(() => {
    (async () => {
      try {
        const [v, listings] = await Promise.all([getVendorById(id), getCleaningListings(id)]);
        setVendor(v);
        setListing(listings[0] || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate().toString(),
      full: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Info', 'Please select a date and time');
      return;
    }
    router.push({
      pathname: '/checkout/payment',
      params: {
        serviceName: listing?.title || 'Cleaning Service',
        amount: (listing?.basePrice || 0).toString(),
        date: selectedDate,
        time: selectedTime,
        notes,
        vendorId: id,
        category: 'CLEANING',
        listingId: listing?.id || '',
        serviceFee: '10',
      },
    });
  };

  const canConfirm = !!selectedDate && !!selectedTime;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Service</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Service Card */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceLogoCircle}>
            {vendor?.logo
              ? <Image source={{ uri: vendor.logo }} style={styles.serviceLogoImg} />
              : <Ionicons name="sparkles" size={24} color={colors.primary} />}
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{listing?.title || 'Cleaning Service'}</Text>
            <Text style={styles.vendorName}>{vendor?.businessName || 'Service Provider'}</Text>
            <Text style={styles.servicePrice}>${listing?.basePrice || 0}</Text>
          </View>
        </View>

        {/* Select Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity
            style={styles.pickerRow}
            onPress={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}
          >
            <View style={styles.pickerLeft}>
              <View style={styles.pickerIconBox}>
                <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.pickerText, selectedDate && styles.pickerTextSelected]}>
                {selectedDate ? dates.find(d => d.full === selectedDate)?.label || selectedDate : 'Choose a date'}
              </Text>
            </View>
            <Ionicons name={showDatePicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.text.muted} />
          </TouchableOpacity>

          {showDatePicker && (
            <View style={styles.dateDropdown}>
              {dates.map((d) => (
                <TouchableOpacity
                  key={d.full}
                  style={[styles.dateDropdownItem, selectedDate === d.full && styles.dateDropdownItemActive]}
                  onPress={() => { setSelectedDate(d.full); setShowDatePicker(false); }}
                >
                  <Text style={[styles.dateDropdownText, selectedDate === d.full && styles.dateDropdownTextActive]}>
                    {d.day}, {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Select Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <TouchableOpacity
            style={styles.pickerRow}
            onPress={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}
          >
            <View style={styles.pickerLeft}>
              <View style={styles.pickerIconBox}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.pickerText, selectedTime && styles.pickerTextSelected]}>
                {selectedTime || 'Choose a time'}
              </Text>
            </View>
            <Ionicons name={showTimePicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.text.muted} />
          </TouchableOpacity>

          {showTimePicker && (
            <View style={styles.timeDropdown}>
              <View style={styles.timeGrid}>
                {TIME_SLOTS.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.timeChip, selectedTime === time && styles.timeChipActive]}
                    onPress={() => { setSelectedTime(time); setShowTimePicker(false); }}
                  >
                    <Text style={[styles.timeChipText, selectedTime === time && styles.timeChipTextActive]}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Service Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Address</Text>
          <TouchableOpacity
            style={styles.pickerRow}
            onPress={() => router.push('/profile/addresses')}
          >
            <View style={styles.pickerLeft}>
              <View style={styles.pickerIconBox}>
                <Ionicons name="location-outline" size={18} color={colors.primary} />
              </View>
              {defaultAddress ? (
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressLabel}>{defaultAddress.label || defaultAddress.type}</Text>
                  <Text style={styles.addressSub} numberOfLines={1}>
                    {defaultAddress.street}, {defaultAddress.city}
                  </Text>
                </View>
              ) : (
                <Text style={styles.pickerText}>Add an address</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity
            style={styles.pickerRow}
            onPress={() => router.push('/profile/payment-methods' as any)}
          >
            <View style={styles.pickerLeft}>
              <View style={styles.pickerIconBox}>
                <Ionicons name="card-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.pickerTextSelected}>•••• 9012</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceSummaryLabel}>Service Price</Text>
            <Text style={styles.priceSummaryValue}>${listing?.basePrice || 0}</Text>
          </View>
          <Text style={styles.priceNote}>Final price will be confirmed by the service provider</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!canConfirm}
        >
          <Text style={[styles.confirmBtnText, !canConfirm && styles.confirmBtnTextDisabled]}>
            Confirm Booking
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46,122,217,0.08)',
  },
  backBtn: { padding: spacing.xs, width: 36 },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },

  scrollContent: { padding: spacing.lg },

  // Service card
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.1)',
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  serviceLogoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  serviceLogoImg: { width: 52, height: 52, borderRadius: 26 },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary, marginBottom: 2 },
  vendorName: { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: 4 },
  servicePrice: { fontSize: fontSize.sm, fontWeight: '600', color: colors.primary },

  // Sections
  section: { marginBottom: spacing.xl },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  // Picker rows
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.1)',
    padding: spacing.md,
  },
  pickerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  pickerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerText: { fontSize: fontSize.md, color: colors.text.muted },
  pickerTextSelected: { fontSize: fontSize.md, color: colors.text.primary, fontWeight: '500' },
  addressLabel: { fontSize: fontSize.md, fontWeight: '500', color: colors.text.primary },
  addressSub: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 1 },

  // Date dropdown
  dateDropdown: {
    marginTop: 4,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.1)',
    overflow: 'hidden',
  },
  dateDropdownItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46,122,217,0.06)',
  },
  dateDropdownItemActive: { backgroundColor: 'rgba(46,122,217,0.06)' },
  dateDropdownText: { fontSize: fontSize.md, color: colors.text.primary },
  dateDropdownTextActive: { color: colors.primary, fontWeight: '600' },

  // Time dropdown
  timeDropdown: {
    marginTop: 4,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.1)',
    padding: spacing.md,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeChip: {
    width: '47%',
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    backgroundColor: colors.background,
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeChipText: { fontSize: fontSize.sm, color: colors.text.primary },
  timeChipTextActive: { color: '#FFFFFF', fontWeight: '500' },

  // Notes
  notesInput: {
    backgroundColor: colors.surface,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    minHeight: 90,
  },

  // Price summary
  priceSummary: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.08)',
    padding: spacing.md,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  priceSummaryLabel: { fontSize: fontSize.md, color: colors.text.secondary },
  priceSummaryValue: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  priceNote: { fontSize: fontSize.xs, color: colors.text.muted, marginTop: 2 },

  // CTA
  ctaContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: spacing.lg,
    paddingBottom: 28,
    backgroundColor: colors.background,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46,122,217,0.1)',
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: 'rgba(46,122,217,0.2)',
  },
  confirmBtnText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  confirmBtnTextDisabled: {
    color: 'rgba(46,122,217,0.5)',
  },
});
