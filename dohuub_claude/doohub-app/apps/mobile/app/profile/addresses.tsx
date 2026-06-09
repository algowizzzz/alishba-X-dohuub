import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { supabase } from '../../src/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';

const ADDRESS_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  HOME: 'home',
  WORK: 'briefcase-outline',
  OTHER: 'location-outline',
  Home: 'home',
  Work: 'briefcase-outline',
  Other: 'location-outline',
};

export default function AddressesScreen() {
  const { addresses, deleteAddress, fetchAddresses, setSelectedAddress } = useAuthStore();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEdit = (addressId: string) => {
    router.push({ pathname: '/profile/add-address', params: { id: addressId, edit: 'true' } });
  };

  const handleDelete = (addressId: string) => {
    // RN's Alert.alert with multi-button confirm doesn't fire callbacks on web
    // (RNW stub), so the Delete tap was silently no-op'ing. Use window.confirm
    // on web; Alert.alert still works as expected on iOS/Android.
    if (Platform.OS === 'web') {
      const ok = window.confirm('Are you sure you want to delete this address?');
      if (ok) deleteAddress(addressId);
      return;
    }
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(addressId) },
    ]);
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (userId) {
        await supabase
          .from('Address')
          .update({ isDefault: false, updatedAt: new Date().toISOString() })
          .eq('userId', userId);
        await supabase
          .from('Address')
          .update({ isDefault: true, updatedAt: new Date().toISOString() })
          .eq('id', addressId);
      }
      setSelectedAddress(addressId);
      if (fetchAddresses) fetchAddresses();
    } catch {
      setSelectedAddress(addressId);
    }
  };

  const renderAddress = ({ item }: { item: any }) => {
    const icon = ADDRESS_ICONS[item.type] || ADDRESS_ICONS[item.label] || 'location-outline';
    const isDefault = item.isDefault;

    return (
      <View style={[styles.card, isDefault && styles.cardDefault]}>
        {isDefault && <View style={styles.accentBorder} />}

        <View style={styles.cardInner}>
          <View style={styles.iconCircle}>
            <Ionicons name={icon} size={24} color="#2E7AD9" />
          </View>

          <View style={styles.info}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{item.label || item.type}</Text>
              {isDefault && (
                <LinearGradient
                  colors={['#2E7AD9', '#1E6AC9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.defaultBadge}
                >
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </LinearGradient>
              )}
            </View>
            <Text style={styles.fullAddress} numberOfLines={2}>
              {item.street}{item.city ? `, ${item.city}` : ''}{item.state ? `, ${item.state}` : ''} {item.zipCode || ''}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleEdit(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleDelete(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                isDefault && styles.actionBtnDefault,
              ]}
              onPress={() => handleSetDefault(item.id)}
              activeOpacity={0.7}
              disabled={isDefault}
            >
              <Ionicons
                name={isDefault ? 'star' : 'star-outline'}
                size={20}
                color={isDefault ? '#FFFFFF' : '#64748B'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="location-outline" size={40} color="#94A3B8" />
      </View>
      <Text style={styles.emptyTitle}>No saved addresses yet</Text>
      <Text style={styles.emptyText}>Add your frequently used addresses for faster booking</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Glassmorphic Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Addresses</Text>
        </View>
      </View>

      <FlatList
        data={addresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/profile/add-address')}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color="#2E7AD9" />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
  },

  // Glassmorphic Header
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 8,
  },
  headerContent: {
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
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },

  listContent: {
    padding: 24,
    flexGrow: 1,
  },

  // Address Card
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDefault: {
    // accent border handles visual distinction
  },
  accentBorder: {
    width: 4,
    backgroundColor: '#2E7AD9',
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F1FC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7AD9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  defaultBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    shadowColor: '#2E7AD9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fullAddress: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },

  // Action buttons
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F1FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnDefault: {
    backgroundColor: '#2E7AD9',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F1FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2E7AD9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 260,
  },

  // Add button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: 'rgba(46, 122, 217, 0.25)',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
});
