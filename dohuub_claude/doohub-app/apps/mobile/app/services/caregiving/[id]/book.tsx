import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Button } from '../../../../src/components/ui';
import { getRideListings, getCompanionListings } from '../../../../src/lib/queries';

const TIME_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
];

const DURATION_OPTIONS = [
  { id: '2', label: '2 hours', hours: 2 },
  { id: '4', label: '4 hours', hours: 4 },
  { id: '8', label: '8 hours', hours: 8 },
  { id: '12', label: 'Overnight', hours: 12 },
];

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[1]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const [rides, companions] = await Promise.all([getRideListings(), getCompanionListings()]);
        const mapped = [
          ...rides.map((r: any) => ({
            id: r.id,
            name: r.title,
            pricePerHour: r.hourlyRate,
            vendorId: r.vendorId,
            category: 'RIDE_ASSISTANCE',
          })),
          ...companions.map((c: any) => ({
            id: c.id,
            name: c.title,
            pricePerHour: c.hourlyRate,
            vendorId: c.vendorId,
            category: 'COMPANIONSHIP',
          })),
        ];
        setServices(mapped);
        if (mapped.length > 0) setSelectedService(mapped[0]);
      } catch (error) {
        console.error('Failed to fetch caregiving services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate().toString(),
      full: date.toISOString().split('T')[0],
    };
  });

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select a date and time');
      return;
    }
    if (!selectedService) return;

    const total = selectedService.pricePerHour * selectedDuration.hours;

    router.push({
      pathname: '/checkout/payment',
      params: {
        serviceName: `${selectedService.name} (${selectedDuration.label})`,
        amount: total.toString(),
        date: selectedDate,
        time: selectedTime,
        duration: selectedDuration.hours.toString(),
        notes,
        vendorId: selectedService.vendorId,
        category: selectedService.category,
        listingId: selectedService.id,
        serviceFee: '10',
      },
    });
  };

  const subtotal = selectedService ? selectedService.pricePerHour * selectedDuration.hours : 0;
  const serviceFee = 10;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Book Care Service" showBack />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : services.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
          <Text style={{ fontSize: fontSize.md, color: colors.text.secondary }}>No caregiving services available</Text>
        </View>
      ) : (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type of Care</Text>
          <View style={styles.serviceList}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceOption,
                  selectedService?.id === service.id && styles.serviceOptionActive,
                ]}
                onPress={() => setSelectedService(service)}
              >
                <Text
                  style={[
                    styles.serviceName,
                    selectedService?.id === service.id && styles.serviceNameActive,
                  ]}
                >
                  {service.name}
                </Text>
                <Text
                  style={[
                    styles.servicePrice,
                    selectedService?.id === service.id && styles.servicePriceActive,
                  ]}
                >
                  ${service.pricePerHour}/hr
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationGrid}>
            {DURATION_OPTIONS.map((duration) => (
              <TouchableOpacity
                key={duration.id}
                style={[
                  styles.durationOption,
                  selectedDuration.id === duration.id && styles.durationOptionActive,
                ]}
                onPress={() => setSelectedDuration(duration)}
              >
                <Text
                  style={[
                    styles.durationText,
                    selectedDuration.id === duration.id && styles.durationTextActive,
                  ]}
                >
                  {duration.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateList}>
              {dates.map((d) => (
                <TouchableOpacity
                  key={d.full}
                  style={[
                    styles.dateOption,
                    selectedDate === d.full && styles.dateOptionActive,
                  ]}
                  onPress={() => setSelectedDate(d.full)}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      selectedDate === d.full && styles.dateDayActive,
                    ]}
                  >
                    {d.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      selectedDate === d.full && styles.dateNumberActive,
                    ]}
                  >
                    {d.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Start Time</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeOption,
                  selectedTime === time && styles.timeOptionActive,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Instructions</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="E.g., Dietary restrictions, medication schedule, emergency contacts..."
            placeholderTextColor={colors.text.muted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {selectedService?.name} × {selectedDuration.hours} hrs
            </Text>
            <Text style={styles.priceValue}>${subtotal}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>${serviceFee}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${subtotal + serviceFee}</Text>
          </View>
        </View>
      </ScrollView>
      )}

      <View style={styles.ctaContainer}>
        <Button
          title="Proceed to Payment"
          onPress={handleProceedToPayment}
          fullWidth
          disabled={!selectedDate || !selectedTime || !selectedService}
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
  serviceList: {
    gap: spacing.sm,
  },
  serviceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
  },
  serviceOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
  },
  serviceName: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  serviceNameActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  servicePrice: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  servicePriceActive: {
    color: colors.text.primary,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  durationOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  durationOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  durationText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  durationTextActive: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  dateList: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateOption: {
    width: 60,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
  },
  dateOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateDay: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  dateDayActive: {
    color: colors.border.default,
  },
  dateNumber: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
  },
  dateNumberActive: {
    color: colors.text.inverse,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.md,
  },
  timeOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  timeTextActive: {
    color: colors.text.inverse,
  },
  notesInput: {
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    minHeight: 120,
  },
  priceSummary: {
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  priceLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  priceValue: {
    fontSize: fontSize.md,
    color: colors.primary,
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
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
});

