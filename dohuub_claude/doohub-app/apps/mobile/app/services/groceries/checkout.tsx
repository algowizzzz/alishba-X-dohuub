import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader } from '../../../src/components/composite';
import { Button } from '../../../src/components/ui';
import { useCartStore } from '../../../src/store/cartStore';
import { useAuthStore } from '../../../src/store/authStore';
import { supabase } from '../../../src/lib/supabase';

const DELIVERY_TIMES = [
  { id: 'asap', label: 'ASAP', sublabel: '30-45 min' },
  { id: 'scheduled', label: 'Schedule', sublabel: 'Pick a time' },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: 'card-outline' },
  { id: 'cash', label: 'Cash on Delivery', icon: 'cash-outline' },
];

/**
 * Groceries Checkout Screen matching wireframe:
 * - Delivery address confirmation
 * - Delivery time selection
 * - Order summary
 * - Payment method selection
 * - "Place Order" button
 */
export default function CheckoutScreen() {
  const { subtotal, clearCart, vendorId } = useCartStore();
  const { addresses, selectedAddressId } = useAuthStore();
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('asap');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);
  const deliveryFee = 4.99;
  const serviceFee = 1.99;
  const total = subtotal + deliveryFee + serviceFee;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Not authenticated');

      const orderId = `order-${Date.now()}`;

      const { error: orderError } = await supabase.from('Order').insert({
        id: orderId,
        userId,
        vendorId: vendorId,
        status: 'PENDING',
        subtotal,
        serviceFee,
        deliveryFee,
        total,
        deliveryAddressId: selectedAddressId,
        paymentMethod: selectedPayment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (orderError) throw orderError;

      // Insert order items from cart
      const { items } = useCartStore.getState();
      if (items.length > 0) {
        const orderItems = items.map((item) => ({
          id: `oi-${Date.now()}-${item.id}`,
          orderId,
          listingId: item.listingId,
          name: item.listing?.name || 'Item',
          quantity: item.quantity,
          price: item.listing?.price || 0,
          createdAt: new Date().toISOString(),
        }));

        const { error: itemsError } = await supabase
          .from('OrderItem')
          .insert(orderItems);

        if (itemsError) console.error('Failed to insert order items:', itemsError);
      }

      await clearCart();
      router.replace(`/services/groceries/tracking/${orderId}`);
    } catch (error: any) {
      console.error('Order placement failed:', error);
      Alert.alert('Error', error?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Checkout" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <Ionicons name="location" size={24} color={colors.primary} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>{selectedAddress?.label || 'Home'}</Text>
              <Text style={styles.addressText}>
                {selectedAddress?.street}, {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.zipCode}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/profile/addresses')}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Time</Text>
          <View style={styles.optionsRow}>
            {DELIVERY_TIMES.map((time) => (
              <TouchableOpacity
                key={time.id}
                style={[
                  styles.timeOption,
                  selectedDeliveryTime === time.id && styles.timeOptionActive,
                ]}
                onPress={() => setSelectedDeliveryTime(time.id)}
              >
                <Text
                  style={[
                    styles.timeLabel,
                    selectedDeliveryTime === time.id && styles.timeLabelActive,
                  ]}
                >
                  {time.label}
                </Text>
                <Text
                  style={[
                    styles.timeSublabel,
                    selectedDeliveryTime === time.id && styles.timeSublabelActive,
                  ]}
                >
                  {time.sublabel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryValue}>${serviceFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment === method.id && styles.paymentOptionActive,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <Ionicons
                name={method.icon as any}
                size={24}
                color={selectedPayment === method.id ? colors.text.primary : colors.text.secondary}
              />
              <Text
                style={[
                  styles.paymentLabel,
                  selectedPayment === method.id && styles.paymentLabelActive,
                ]}
              >
                {method.label}
              </Text>
              <View
                style={[
                  styles.radioOuter,
                  selectedPayment === method.id && styles.radioOuterActive,
                ]}
              >
                {selectedPayment === method.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Place Order CTA */}
      <View style={styles.ctaContainer}>
        <Button
          title={`Place Order - $${total.toFixed(2)}`}
          onPress={handlePlaceOrder}
          fullWidth
          loading={isPlacingOrder}
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
    paddingBottom: 100,
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
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.lg,
    gap: spacing.md,
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
    lineHeight: 20,
  },
  changeText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    textDecorationLine: 'underline',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeOption: {
    flex: 1,
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  timeOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
  },
  timeLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  timeLabelActive: {
    color: colors.text.primary,
  },
  timeSublabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  timeSublabelActive: {
    color: colors.text.primary,
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
  summaryTotal: {
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.border.default,
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
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
  },
  paymentLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  paymentLabelActive: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.text.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
});

