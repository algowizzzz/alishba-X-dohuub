import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button, EmptyState } from '../../src/components/ui';
import { getPaymentMethods } from '../../src/lib/queries';
import { useAuthStore } from '../../src/store/authStore';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const getCardIcon = (type: string) => {
  switch (type) {
    case 'visa':
      return '💳';
    case 'mastercard':
      return '💳';
    case 'amex':
      return '💳';
    default:
      return '💳';
  }
};

const getCardName = (type: string) => {
  switch (type) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'Mastercard';
    case 'amex':
      return 'American Express';
    default:
      return 'Card';
  }
};

/**
 * Payment Methods List Screen matching wireframe:
 * - Header: "Payment Methods"
 * - List of saved cards
 * - Default card indicator
 * - Add new card button
 */
export default function PaymentMethodsScreen() {
  const user = useAuthStore((s) => s.user);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPaymentMethods = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getPaymentMethods(user.id);
      const mapped: PaymentMethod[] = (data || []).map((pm: any) => ({
        id: pm.id,
        type: (pm.type || '').toLowerCase() as PaymentMethod['type'],
        last4: pm.last4 || '',
        expiry: `${pm.expiryMonth}/${String(pm.expiryYear).slice(-2)}`,
        isDefault: !!pm.isDefault,
      }));
      setPaymentMethods(mapped);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    setIsLoading(true);
    fetchPaymentMethods().finally(() => setIsLoading(false));
  }, [fetchPaymentMethods]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPaymentMethods();
    setRefreshing(false);
  };

  const handleAddCard = () => {
    router.push('/profile/add-payment');
  };

  const handleEditCard = (cardId: string) => {
    router.push(`/profile/edit-payment/${cardId}`);
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => handleEditCard(item.id)}
    >
      <View style={styles.cardIcon}>
        <Text style={styles.cardEmoji}>{getCardIcon(item.type)}</Text>
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{getCardName(item.type)}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardNumber}>•••• •••• •••• {item.last4}</Text>
        <Text style={styles.cardExpiry}>Expires {item.expiry}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Payment Methods" showBack />

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : paymentMethods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="card-outline"
            title="No payment methods"
            message="Add a card to make payments faster and easier"
          />
          <Button
            title="Add Payment Method"
            onPress={handleAddCard}
            style={styles.addButtonEmpty}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={paymentMethods}
            keyExtractor={(item) => item.id}
            renderItem={renderPaymentMethod}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <Button
              title="Add Payment Method"
              onPress={handleAddCard}
              fullWidth
            />
          </View>
        </>
      )}
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
  addButtonEmpty: {
    marginTop: spacing.lg,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  defaultBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.status.success,
    borderRadius: borderRadius.sm,
  },
  defaultText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  cardNumber: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontFamily: 'monospace',
    marginBottom: spacing.xs,
  },
  cardExpiry: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
});

