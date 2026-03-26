import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader, CartItem } from '../../../src/components/composite';
import { Button, EmptyState } from '../../../src/components/ui';
import { useCartStore } from '../../../src/store/cartStore';
import { useAuthStore } from '../../../src/store/authStore';

/**
 * Groceries Cart Screen matching wireframe:
 * - Header: "Your Cart"
 * - Vendor info
 * - Cart items list (CartItem component)
 * - Delivery address selection
 * - Order summary (subtotal, delivery, fees, total)
 * - "Proceed to Checkout" button
 */
export default function CartScreen() {
  const { items, vendor, subtotal, updateQuantity, removeItem, clearCart, fetchCart, error, clearError, isLoading } = useCartStore();
  const { addresses, selectedAddressId } = useAuthStore();
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const deliveryFee = 4.99;
  const serviceFee = 1.99;
  const total = subtotal + deliveryFee + serviceFee;

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRetry = async () => {
    clearError();
    await fetchCart();
  };

  const handleIncrement = async (itemId: string, currentQuantity: number) => {
    await updateQuantity(itemId, currentQuantity + 1);
  };

  const handleDecrement = async (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      await updateQuantity(itemId, currentQuantity - 1);
    }
  };

  const handleRemove = async (itemId: string) => {
    await removeItem(itemId);
  };

  const handleChangeAddress = () => {
    router.push('/profile/addresses');
  };

  const handleCheckout = () => {
    router.push('/services/groceries/checkout');
  };

  // Show error state if there's an error
  if (error && items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Your Cart" showBack />
        <View style={styles.emptyContainer}>
          <View style={styles.errorIcon}>
            <Ionicons name="alert-circle-outline" size={64} color="#991B1B" />
          </View>
          <Text style={styles.errorTitle}>Unable to load cart</Text>
          <Text style={styles.errorMessage}>{error || 'Please check your connection and try again'}</Text>
          <Button
            title="Try Again"
            onPress={handleRetry}
            loading={isLoading}
            style={styles.browseButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Your Cart" showBack />
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="cart-outline"
            title="Your cart is empty"
            message="Start shopping to add items to your cart"
          />
          <Button
            title="Browse Stores"
            onPress={() => router.push('/services/groceries')}
            style={styles.browseButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Your Cart" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vendor Info */}
        {vendor && (
          <View style={styles.vendorInfo}>
            <Ionicons name="storefront-outline" size={24} color={colors.text.secondary} />
            <Text style={styles.vendorName}>{vendor.businessName || 'Vendor'}</Text>
          </View>
        )}

        {/* Cart Items */}
        <View style={styles.cartItems}>
          {items.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              name={item.listing?.title || 'Item'}
              price={item.listing?.price || 0}
              quantity={item.quantity}
              image={item.listing?.images?.[0]}
              onIncrement={() => handleIncrement(item.id, item.quantity)}
              onDecrement={() => handleDecrement(item.id, item.quantity)}
              onRemove={() => handleRemove(item.id)}
            />
          ))}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TouchableOpacity style={styles.addressCard} onPress={handleChangeAddress}>
            <Ionicons name="location-outline" size={24} color={colors.text.secondary} />
            <View style={styles.addressInfo}>
              {selectedAddress ? (
                <>
                  <Text style={styles.addressLabel}>{selectedAddress.label}</Text>
                  <Text style={styles.addressText}>
                    {selectedAddress.street}, {selectedAddress.city}
                  </Text>
                </>
              ) : (
                <Text style={styles.addressText}>Select delivery address</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
          </TouchableOpacity>
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
      </ScrollView>

      {/* Checkout CTA */}
      <View style={styles.ctaContainer}>
        <Button
          title={`Proceed to Checkout - $${total.toFixed(2)}`}
          onPress={handleCheckout}
          fullWidth
          disabled={!selectedAddress}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  browseButton: {
    marginTop: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  vendorName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  cartItems: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
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
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
  errorIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
    maxWidth: 280,
  },
});

