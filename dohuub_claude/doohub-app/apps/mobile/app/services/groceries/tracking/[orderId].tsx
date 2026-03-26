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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Button } from '../../../../src/components/ui';
import { getOrderById } from '../../../../src/lib/queries';

const ORDER_STATUSES = [
  { id: 'PLACED', label: 'Order Placed', icon: 'checkmark-circle' },
  { id: 'CONFIRMED', label: 'Confirmed', icon: 'checkmark-done-circle' },
  { id: 'PREPARING', label: 'Preparing', icon: 'restaurant' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: 'bicycle' },
  { id: 'DELIVERED', label: 'Delivered', icon: 'home' },
];

type OrderData = {
  id: string;
  status: string;
  totalAmount: number;
  deliveryFee: number | null;
  estimatedDelivery: string | null;
  driverName: string | null;
  driverPhone: string | null;
  driverVehicle: string | null;
  createdAt: string;
  OrderItem: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  Vendor: {
    id: string;
    businessName: string;
    logo: string | null;
    rating: number;
    contactPhone: string | null;
  } | null;
};

/**
 * Groceries Order Tracking Screen matching wireframe:
 * - Order status timeline
 * - Estimated delivery time
 * - Driver info (when assigned)
 * - Contact driver button
 * - Order details expandable
 */
export default function OrderTrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrderById(orderId!);
      setOrder(data as unknown as OrderData);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Order Status" showBack />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const currentStatusIndex = ORDER_STATUSES.findIndex(s => s.id === order.status);
  const isDriverAssigned = currentStatusIndex >= 3; // OUT_FOR_DELIVERY index

  const handleContactDriver = () => {
    if (order.driverPhone) {
      Linking.openURL(`tel:${order.driverPhone}`);
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@dohuub.com?subject=Order%20Support');
  };

  const orderTotal = order.totalAmount ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Order Status" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order ID */}
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderId}>{order.id.slice(0, 12)}...</Text>
        </View>

        {/* Estimated Delivery */}
        <View style={styles.estimatedDelivery}>
          <Text style={styles.estimatedLabel}>Estimated Delivery</Text>
          <Text style={styles.estimatedTime}>{order.estimatedDelivery ?? 'Calculating...'}</Text>
        </View>

        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.timeline}>
            {ORDER_STATUSES.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

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
                        size={20}
                        color={isCompleted ? colors.text.inverse : colors.text.muted}
                      />
                    </View>
                    {index < ORDER_STATUSES.length - 1 && (
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
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Driver Info */}
        {isDriverAssigned && order.driverName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Driver</Text>
            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={24} color={colors.text.muted} />
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{order.driverName}</Text>
                {order.driverVehicle && (
                  <Text style={styles.driverVehicle}>{order.driverVehicle}</Text>
                )}
              </View>
              {order.driverPhone && (
                <TouchableOpacity style={styles.callButton} onPress={handleContactDriver}>
                  <Ionicons name="call" size={20} color={colors.text.inverse} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Order Details */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.orderDetailsHeader}
            onPress={() => setShowOrderDetails(!showOrderDetails)}
          >
            <Text style={styles.sectionTitle}>Order Details</Text>
            <Ionicons
              name={showOrderDetails ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>

          {showOrderDetails && (
            <View style={styles.orderDetails}>
              {order.Vendor && (
                <View style={styles.vendorRow}>
                  <Ionicons name="storefront-outline" size={20} color={colors.text.secondary} />
                  <Text style={styles.vendorName}>{order.Vendor.businessName}</Text>
                </View>
              )}

              {(order.OrderItem ?? []).map((item, index) => (
                <View key={item.id ?? index} style={styles.itemRow}>
                  <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${orderTotal.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Support */}
        <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
          <Ionicons name="help-circle-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.supportText}>Need help with your order?</Text>
        </TouchableOpacity>
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
  orderIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  orderIdLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  orderId: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'monospace',
  },
  estimatedDelivery: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  estimatedLabel: {
    fontSize: fontSize.sm,
    color: colors.border.default,
    marginBottom: spacing.xs,
  },
  estimatedTime: {
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
    minHeight: 60,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingTop: spacing.sm,
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
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  driverVehicle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetails: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.lg,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  vendorName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  itemQuantity: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  itemPrice: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
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
});

