import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Button, Input } from '../../../../src/components/ui';

/**
 * Groceries booking screen matching wireframe:
 * - Delivery address selection
 * - Delivery time slots
 * - Shopping list input
 * - Special instructions
 * - Price summary
 */
export default function GroceriesBookingScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate().toString(),
      fullDate: date,
    };
  });

  const TIME_SLOTS = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM',
  ];

  const deliveryFee = 5;
  const serviceFee = 3;
  const estimatedTotal = deliveryFee + serviceFee;

  const handleProceed = () => {
    if (!selectedTimeSlot) {
      Alert.alert('Error', 'Please select a delivery time slot');
      return;
    }

    if (!shoppingList.trim()) {
      Alert.alert('Error', 'Please add items to your shopping list');
      return;
    }

    setIsLoading(true);

    // Navigate to payment
    router.push({
      pathname: '/checkout/payment',
      params: {
        serviceName: name || 'Grocery Delivery',
        amount: estimatedTotal.toString(),
        date: selectedDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        time: selectedTimeSlot,
        notes: `Shopping List:\n${shoppingList}\n\nInstructions: ${specialInstructions}`,
      },
    });

    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Schedule Delivery" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TouchableOpacity style={styles.addressCard}>
            <View style={styles.addressIcon}>
              <Ionicons name="home" size={20} color={colors.text.secondary} />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Home</Text>
              <Text style={styles.addressText}>123 Main Street, Apt 4B</Text>
              <Text style={styles.addressText}>New York, NY 10001</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Delivery Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateList}>
              {dates.map((d, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateOption,
                    selectedDate.toDateString() === d.fullDate.toDateString() &&
                      styles.dateOptionActive,
                  ]}
                  onPress={() => setSelectedDate(d.fullDate)}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      selectedDate.toDateString() === d.fullDate.toDateString() &&
                        styles.dateDayActive,
                    ]}
                  >
                    {d.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      selectedDate.toDateString() === d.fullDate.toDateString() &&
                        styles.dateNumberActive,
                    ]}
                  >
                    {d.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Time Slot Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time Slot</Text>
          <View style={styles.timeSlotGrid}>
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === slot && styles.timeSlotActive,
                ]}
                onPress={() => setSelectedTimeSlot(slot)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTimeSlot === slot && styles.timeSlotTextActive,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Shopping List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shopping List</Text>
          <TextInput
            style={styles.shoppingListInput}
            placeholder="Enter items (one per line)&#10;e.g.&#10;- Milk (1 gallon)&#10;- Eggs (1 dozen)&#10;- Bread (whole wheat)"
            value={shoppingList}
            onChangeText={setShoppingList}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={colors.text.muted}
          />
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Input
            label="Special Instructions (Optional)"
            placeholder="e.g., Prefer organic, no substitutions for dairy"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <Text style={styles.priceSummaryTitle}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={styles.priceValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Items Total</Text>
            <Text style={styles.priceValue}>TBD at checkout</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Estimated Fees</Text>
            <Text style={styles.totalValue}>${estimatedTotal.toFixed(2)}</Text>
          </View>
          <Text style={styles.priceNote}>
            * Final total will include item costs at checkout
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button
          title="Proceed to Payment"
          onPress={handleProceed}
          loading={isLoading}
          fullWidth
          disabled={!selectedTimeSlot || !shoppingList.trim()}
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
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  addressText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
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
    backgroundColor: colors.background,
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
  timeSlotGrid: {
    gap: spacing.sm,
  },
  timeSlot: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  timeSlotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  timeSlotTextActive: {
    color: colors.text.inverse,
    fontWeight: '500',
  },
  shoppingListInput: {
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    minHeight: 150,
    backgroundColor: colors.background,
  },
  priceSummary: {
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.lg,
  },
  priceSummaryTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
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
  priceNote: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
});

