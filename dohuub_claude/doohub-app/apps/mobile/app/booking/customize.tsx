import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/authStore';

const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
];

const SERVICE_TYPES_BY_CATEGORY: Record<string, string[]> = {
  CLEANING: ['Deep Cleaning', 'Laundry', 'Office Cleaning'],
  HANDYMAN: ['Plumbing', 'Electrical', 'Installation'],
  BEAUTY: ['Makeup', 'Hair', 'Nails', 'Wellness'],
  RIDE_ASSISTANCE: ['Doctor Visit', 'Pharmacy Pickup', 'General'],
  COMPANIONSHIP: ['Wellness Visit', 'Errand Help'],
};

/**
 * Booking Customization screen matching wireframe:
 * - Header: "Book Service"
 * - Service type chips (scrollable)
 * - Date picker with calendar icon
 * - Time picker grid
 * - Address selector cards
 * - Special instructions textarea
 * - Price summary card (Service + Fee = Total)
 * - Continue to Payment button
 */
export default function BookingCustomizeScreen() {
  const params = useLocalSearchParams<{
    vendorId?: string;
    listingId?: string;
    category?: string;
    serviceName?: string;
    amount?: string;
    serviceFee?: string;
  }>();

  const { addresses } = useAuthStore();

  const categoryEnum = (params.category || 'CLEANING').toUpperCase();
  const serviceTypes = SERVICE_TYPES_BY_CATEGORY[categoryEnum] || SERVICE_TYPES_BY_CATEGORY.CLEANING;

  const subtotal = parseFloat(params.amount || '0') || 0;
  const serviceFee = parseFloat(params.serviceFee || '0') || (subtotal > 0 ? Math.round(subtotal * 0.05 * 100) / 100 : 0);
  const totalAmount = subtotal + serviceFee;

  const defaultAddress = useMemo(
    () => addresses?.find((a) => a.isDefault) || addresses?.[0],
    [addresses]
  );

  const [serviceType, setServiceType] = useState(serviceTypes[0]);
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<string>(defaultAddress?.id || '');
  const [instructions, setInstructions] = useState('');

  const isValid = !!date && !!selectedTime && !!selectedAddress && !!params.vendorId;

  const handleContinue = () => {
    if (!isValid) return;
    if (!params.vendorId) {
      Alert.alert('Missing vendor', 'Please open this booking from a listing.');
      return;
    }
    if (subtotal <= 0) {
      Alert.alert('Missing price', 'Listing price is missing. Please go back and try again.');
      return;
    }
    router.push({
      pathname: '/checkout/payment',
      params: {
        serviceName: params.serviceName || serviceType,
        amount: subtotal.toString(),
        serviceFee: serviceFee.toString(),
        date,
        time: selectedTime,
        notes: instructions,
        vendorId: params.vendorId,
        category: categoryEnum,
        listingId: params.listingId || '',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipRow}>
              {serviceTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.chip, serviceType === type && styles.chipActive]}
                  onPress={() => setServiceType(type)}
                >
                  <Text style={[styles.chipText, serviceType === type && styles.chipTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color={colors.text.muted} />
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="Select date (e.g. 2026-03-15)"
              placeholderTextColor={colors.text.muted}
            />
          </View>
        </View>

        {/* Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time *</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.timeSlot, selectedTime === slot && styles.timeSlotActive]}
                onPress={() => setSelectedTime(slot)}
              >
                <Text style={[styles.timeSlotText, selectedTime === slot && styles.timeSlotTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address *</Text>
          <View style={styles.addressList}>
            {addresses.length === 0 && (
              <Text style={styles.addressDetail}>
                No saved addresses. Add one from your profile to continue.
              </Text>
            )}
            {addresses.map((addr) => {
              const iconName =
                addr.type === 'HOME'
                  ? 'home'
                  : addr.type === 'WORK'
                  ? 'business'
                  : 'location';
              const detail = `${addr.street}${addr.apartment ? ' ' + addr.apartment : ''}, ${addr.city}, ${addr.state}`;
              return (
                <TouchableOpacity
                  key={addr.id}
                  style={[styles.addressCard, selectedAddress === addr.id && styles.addressCardActive]}
                  onPress={() => setSelectedAddress(addr.id)}
                >
                  <View style={styles.addressIcon}>
                    <Ionicons
                      name={iconName as any}
                      size={20}
                      color={selectedAddress === addr.id ? colors.primary : colors.text.muted}
                    />
                  </View>
                  <View style={styles.addressInfo}>
                    <Text style={styles.addressLabel}>{addr.label || addr.type}</Text>
                    <Text style={styles.addressDetail}>{detail}</Text>
                  </View>
                  {selectedAddress === addr.id && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={() => router.push('/profile/addresses')}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.addAddressText}>Add new address</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
          <View style={styles.instructionsContainer}>
            <Ionicons name="document-text-outline" size={20} color={colors.text.muted} style={{ marginTop: 2 }} />
            <TextInput
              style={styles.instructionsInput}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="e.g., We have pets, use eco-friendly products"
              placeholderTextColor={colors.text.muted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section - Price Summary + CTA */}
      <View style={styles.bottomSection}>
        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service</Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!isValid}
        >
          <Text style={[styles.continueButtonText, !isValid && styles.continueButtonTextDisabled]}>
            Continue to Payment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 260,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: '#4CA6FA',
    shadowOpacity: 0.3,
  },
  chipText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border.default,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeSlot: {
    width: '23%',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  timeSlotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: '500',
  },
  timeSlotTextActive: {
    color: '#FFFFFF',
  },
  addressList: {
    gap: spacing.sm,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  addressCardActive: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'rgba(46, 122, 217, 0.05)',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
  },
  addressDetail: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  instructionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border.default,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  instructionsInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
    minHeight: 100,
  },
  bottomSection: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
  priceSummary: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  priceValue: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  priceDivider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  continueButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    shadowColor: '#4CA6FA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.39,
    shadowRadius: 7,
    elevation: 3,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: colors.text.muted,
  },
});
