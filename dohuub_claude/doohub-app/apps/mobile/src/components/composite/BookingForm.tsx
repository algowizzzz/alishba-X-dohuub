import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight, borderWidth } from '../../constants/theme';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

// Only import DateTimePicker on native platforms
let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface BookingFormProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedTime?: string;
  onTimeChange: (time: string) => void;
  timeSlots?: TimeSlot[];
  notes: string;
  onNotesChange: (notes: string) => void;
  selectedAddress?: string;
  onSelectAddress?: () => void;
  showAddressSelection?: boolean;
}

/**
 * Booking Form matching wireframes
 * - Date picker
 * - Time slot selection
 * - Address selection
 * - Notes input
 */
export function BookingForm({
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  timeSlots = DEFAULT_TIME_SLOTS,
  notes,
  onNotesChange,
  selectedAddress,
  onSelectAddress,
  showAddressSelection = true,
}: BookingFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      onDateChange(date);
    }
  };

  return (
    <View style={styles.container}>
      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.text.muted} />
        </TouchableOpacity>
        {showDatePicker && Platform.OS !== 'web' && DateTimePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
        {showDatePicker && Platform.OS === 'web' && (
          <TextInput
            style={styles.webDateInput}
            value={selectedDate.toISOString().split('T')[0]}
            onChangeText={(text) => {
              const date = new Date(text);
              if (!isNaN(date.getTime())) {
                onDateChange(date);
              }
            }}
            placeholder="YYYY-MM-DD"
          />
        )}
      </View>

      {/* Time Slot Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeSlotGrid}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.timeSlot,
                selectedTime === slot.time && styles.timeSlotSelected,
                !slot.available && styles.timeSlotDisabled,
              ]}
              onPress={() => slot.available && onTimeChange(slot.time)}
              disabled={!slot.available}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  selectedTime === slot.time && styles.timeSlotTextSelected,
                  !slot.available && styles.timeSlotTextDisabled,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Address Selection */}
      {showAddressSelection && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Location</Text>
          <TouchableOpacity
            style={styles.addressButton}
            onPress={onSelectAddress}
          >
            <Ionicons name="location-outline" size={20} color={colors.text.secondary} />
            <Text
              style={[
                styles.addressText,
                !selectedAddress && styles.addressPlaceholder,
              ]}
              numberOfLines={1}
            >
              {selectedAddress || 'Select an address'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
          </TouchableOpacity>
        </View>
      )}

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
        <Input
          placeholder="Any special instructions or requests..."
          value={notes}
          onChangeText={onNotesChange}
          multiline
          numberOfLines={3}
          style={styles.notesInput}
          containerStyle={styles.notesContainer}
        />
      </View>
    </View>
  );
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '9:00 AM', available: true },
  { id: '2', time: '10:00 AM', available: true },
  { id: '3', time: '11:00 AM', available: false },
  { id: '4', time: '12:00 PM', available: true },
  { id: '5', time: '1:00 PM', available: true },
  { id: '6', time: '2:00 PM', available: true },
  { id: '7', time: '3:00 PM', available: false },
  { id: '8', time: '4:00 PM', available: true },
  { id: '9', time: '5:00 PM', available: true },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  dateText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeSlot: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    backgroundColor: colors.background,
    minWidth: 90,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotDisabled: {
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderColor: 'rgba(46, 122, 217, 0.1)',
  },
  timeSlotText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  timeSlotTextSelected: {
    color: colors.background,
  },
  timeSlotTextDisabled: {
    color: colors.text.muted,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  addressText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  addressPlaceholder: {
    color: colors.text.muted,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  notesContainer: {
    marginBottom: 0,
  },
  webDateInput: {
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
});

