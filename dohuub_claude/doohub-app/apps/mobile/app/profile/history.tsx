import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { EmptyState } from '../../src/components/ui';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/store/authStore';

interface OrderHistoryItem {
  id: string;
  serviceName: string;
  providerName: string;
  date: string;
  status: 'COMPLETED' | 'CANCELLED';
  totalPrice: number;
  category: string;
}

/**
 * Order History screen matching wireframe:
 * - List of past orders
 * - Order status badges
 * - Reorder option for completed orders
 */
export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const userId = useAuthStore((s) => s.user?.id);

  const fetchHistory = async () => {
    if (!userId) return;
    try {
      const { data: bookings, error } = await supabase
        .from('Booking')
        .select('*, Vendor(id, businessName)')
        .eq('userId', userId)
        .in('status', ['COMPLETED', 'CANCELLED'])
        .order('createdAt', { ascending: false });
      if (error) throw error;
      setOrders((bookings || []).map((b: any) => ({
        id: b.id,
        serviceName: b.category?.replace('_', ' ') || 'Service',
        providerName: b.Vendor?.businessName || 'Provider',
        date: new Date(b.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: b.status,
        totalPrice: b.total,
        category: b.category?.toLowerCase() || 'cleaning',
      })));
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter.toUpperCase();
  });

  const handleOrderPress = (order: OrderHistoryItem) => {
    router.push({
      pathname: '/bookings/[id]',
      params: { id: order.id },
    });
  };

  const handleReorder = (order: OrderHistoryItem) => {
    router.push(`/services/${order.category}` as any);
  };

  const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    switch (category) {
      case 'cleaning':
        return 'sparkles';
      case 'handyman':
        return 'hammer';
      case 'groceries':
        return 'basket';
      case 'beauty':
        return 'cut';
      case 'rentals':
        return 'home';
      case 'caregiving':
        return 'heart';
      default:
        return 'cube';
    }
  };

  const renderOrder = ({ item }: { item: OrderHistoryItem }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderPress(item)}>
      <View style={styles.orderHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={getCategoryIcon(item.category)} size={24} color={colors.text.secondary} />
        </View>
        <View style={styles.orderInfo}>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
          <Text style={styles.providerName}>{item.providerName}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'COMPLETED' ? styles.completedBadge : styles.cancelledBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'COMPLETED' ? styles.completedText : styles.cancelledText,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <Text style={styles.totalPrice}>${item.totalPrice.toFixed(2)}</Text>
      </View>

      {item.status === 'COMPLETED' && (
        <TouchableOpacity
          style={styles.reorderButton}
          onPress={() => handleReorder(item)}
        >
          <Ionicons name="refresh" size={16} color={colors.primary} />
          <Text style={styles.reorderText}>Reorder</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Order History" showBack />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'completed', 'cancelled'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No Orders Found"
            description={
              filter === 'all'
                ? "You haven't made any orders yet."
                : `No ${filter} orders found.`
            }
          />
        }
      />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.text.inverse,
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  orderCard: {
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  orderInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  providerName: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  completedBadge: {
    backgroundColor: '#DCFCE7',
  },
  cancelledBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  completedText: {
    color: '#166534',
  },
  cancelledText: {
    color: '#991B1B',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  totalPrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.md,
  },
  reorderText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.primary,
  },
});

