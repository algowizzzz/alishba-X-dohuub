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
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getPaymentMethods } from '../../src/lib/queries';
import { useAuthStore } from '../../src/store/authStore';
import { supabase } from '../../src/lib/supabase';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const getCardType = (type: string) => {
  switch (type) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'Mastercard';
    case 'amex':
      return 'Amex';
    default:
      return 'Card';
  }
};

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
        expiry: `${String(pm.expiryMonth).padStart(2, '0')}/${String(pm.expiryYear).slice(-2)}`,
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

  const handleDeleteCard = async (cardId: string) => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await supabase.from('PaymentMethod').delete().eq('id', cardId);
            await fetchPaymentMethods();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete card');
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      const userId = user?.id;
      if (!userId) return;
      // Unset all defaults first
      await supabase.from('PaymentMethod').update({ isDefault: false }).eq('userId', userId);
      // Set new default
      await supabase.from('PaymentMethod').update({ isDefault: true }).eq('id', cardId);
      await fetchPaymentMethods();
    } catch (error) {
      Alert.alert('Error', 'Failed to update default card');
    }
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <View style={styles.cardItem}>
      <View style={styles.cardTopRow}>
        {/* Icon */}
        <LinearGradient
          colors={['#2E7AD9', '#1E6BC9']}
          style={styles.cardIconCircle}
        >
          <Ionicons name="card" size={24} color="#FFFFFF" />
        </LinearGradient>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>
            {getCardType(item.type)} {'\u2022\u2022\u2022\u2022'} {item.last4}
          </Text>
          <Text style={styles.cardExpiry}>Expires {item.expiry}</Text>
          {item.isDefault ? (
            <LinearGradient
              colors={['#2E7AD9', '#1E6BC9']}
              style={styles.defaultBadge}
            >
              <Text style={styles.defaultBadgeText}>Default</Text>
            </LinearGradient>
          ) : (
            <TouchableOpacity
              onPress={() => handleSetDefault(item.id)}
              style={styles.setDefaultBtn}
            >
              <Text style={styles.setDefaultText}>Set as Default</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Edit + Delete buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleEditCard(item.id)}
          >
            <Ionicons name="create-outline" size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDeleteCard(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7FF" />

      {/* Glassmorphic Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#2E7AD9" />
        </View>
      ) : paymentMethods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="card-outline" size={40} color="#64748B" style={{ opacity: 0.5 }} />
          </View>
          <Text style={styles.emptyTitle}>No payment methods added</Text>
          <Text style={styles.emptySubtitle}>Add a card to get started</Text>
        </View>
      ) : (
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
      )}

      {/* Add New Card button (dashed border) */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.addNewCardBtn} onPress={handleAddCard}>
          <Ionicons name="add" size={24} color="#2E7AD9" />
          <Text style={styles.addNewCardText}>Add New Card</Text>
        </TouchableOpacity>

        {/* Secured by Stripe */}
        <View style={styles.stripeBox}>
          <Ionicons name="lock-closed" size={20} color="#2E7AD9" />
          <Text style={styles.stripeText}>Secured by Stripe</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(46, 122, 217, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    opacity: 0.7,
  },
  listContent: {
    padding: 24,
    paddingBottom: 16,
  },
  cardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 16,
  },
  cardIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  setDefaultBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.2)',
  },
  setDefaultText: {
    fontSize: 12,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'flex-start',
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 122, 217, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  addNewCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(46, 122, 217, 0.25)',
    borderRadius: 12,
    marginBottom: 16,
  },
  addNewCardText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  stripeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(46, 122, 217, 0.06)',
  },
  stripeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
});
