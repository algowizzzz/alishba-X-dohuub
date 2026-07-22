import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import api from '../../src/services/api';

const ADDRESS_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  HOME: 'home',
  WORK: 'briefcase-outline',
  OTHER: 'location-outline',
  DOCTOR: 'medical-outline',
  PHARMACY: 'medkit-outline',
  Home: 'home',
  Work: 'briefcase-outline',
  Other: 'location-outline',
};

function formatTypeLabel(type?: string, label?: string) {
  if (label && label.trim()) return label;
  const t = (type || '').toUpperCase();
  if (t === 'HOME') return 'Home';
  if (t === 'WORK') return 'Work';
  if (t === 'DOCTOR') return 'Doctor';
  if (t === 'PHARMACY') return 'Pharmacy';
  return 'Other';
}

export default function AddressesScreen() {
  const { addresses, deleteAddress, fetchAddresses, updateAddress } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [fetchAddresses])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchAddresses();
    } finally {
      setRefreshing(false);
    }
  }, [fetchAddresses]);

  const handleEdit = (addressId: string) => {
    router.push({ pathname: '/profile/add-address', params: { id: addressId, edit: 'true' } });
  };

  const handleDelete = (addressId: string) => {
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
    if (settingDefaultId) return;

    const current = useAuthStore.getState().addresses;
    const target = current.find((a) => a.id === addressId);
    if (!target || target.isDefault) return;

    const previous = current;
    setSettingDefaultId(addressId);

    // Optimistic UI
    useAuthStore.setState({
      addresses: current.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      })),
      selectedAddressId: addressId,
    });

    try {
      // Prefer dedicated endpoint; fall back to full PUT (works on older API builds)
      try {
        await api.post(`/addresses/${addressId}/default`);
      } catch {
        await updateAddress(addressId, {
          type: target.type,
          label: target.label,
          street: target.street,
          apartment: target.apartment,
          city: target.city,
          state: target.state,
          zipCode: target.zipCode,
          country: target.country,
          latitude: target.latitude,
          longitude: target.longitude,
          isDefault: true,
        });
      }
      await fetchAddresses();
    } catch (error: any) {
      useAuthStore.setState({ addresses: previous });
      Alert.alert(
        'Error',
        error?.response?.data?.error || error?.message || 'Failed to set default address'
      );
    } finally {
      setSettingDefaultId(null);
    }
  };

  const renderAddress = ({ item }: { item: any }) => {
    const icon = ADDRESS_ICONS[item.type] || ADDRESS_ICONS[item.label] || 'location-outline';
    const isDefault = !!item.isDefault;
    const isSetting = settingDefaultId === item.id;
    const title = formatTypeLabel(item.type, item.label);
    const line = [
      item.street,
      [item.city, item.state].filter(Boolean).join(', '),
      item.zipCode,
    ]
      .filter(Boolean)
      .join(' · ');

    return (
      <View style={[styles.card, isDefault && styles.cardDefault]}>
        <View style={styles.cardTop}>
          <View style={[styles.iconCircle, isDefault && styles.iconCircleDefault]}>
            <Ionicons name={icon} size={20} color={isDefault ? '#FFFFFF' : '#2E7AD9'} />
          </View>

          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text style={styles.label} numberOfLines={1}>
                {title}
              </Text>
              {isDefault && (
                <View style={styles.defaultChip}>
                  <Ionicons name="checkmark-circle" size={12} color="#2E7AD9" />
                  <Text style={styles.defaultChipText}>Default</Text>
                </View>
              )}
            </View>
            <Text style={styles.fullAddress} numberOfLines={2}>
              {line}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.starBtn, isDefault && styles.starBtnActive]}
            onPress={() => handleSetDefault(item.id)}
            disabled={isDefault || !!settingDefaultId}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isSetting ? (
              <ActivityIndicator size="small" color="#2E7AD9" />
            ) : (
              <Ionicons
                name={isDefault ? 'star' : 'star-outline'}
                size={22}
                color={isDefault ? '#F59E0B' : '#94A3B8'}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.cardFooter}>
          {!isDefault ? (
            <TouchableOpacity
              style={styles.setDefaultBtn}
              onPress={() => handleSetDefault(item.id)}
              disabled={!!settingDefaultId}
              activeOpacity={0.7}
            >
              <Ionicons name="star-outline" size={15} color="#2E7AD9" />
              <Text style={styles.setDefaultText}>
                {isSetting ? 'Updating...' : 'Set as default'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.setDefaultBtnDisabled}>
              <Ionicons name="star" size={15} color="#F59E0B" />
              <Text style={styles.setDefaultTextDisabled}>Default address</Text>
            </View>
          )}

          <View style={styles.footerActions}>
            <TouchableOpacity
              style={styles.footerBtn}
              onPress={() => handleEdit(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={16} color="#64748B" />
              <Text style={styles.footerBtnText}>Edit</Text>
            </TouchableOpacity>
            <View style={styles.footerDivider} />
            <TouchableOpacity
              style={styles.footerBtn}
              onPress={() => handleDelete(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text style={[styles.footerBtnText, { color: '#EF4444' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="location-outline" size={36} color="#94A3B8" />
      </View>
      <Text style={styles.emptyTitle}>No saved addresses yet</Text>
      <Text style={styles.emptyText}>
        Add your frequently used addresses for faster booking
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7AD9']}
            tintColor="#2E7AD9"
          />
        }
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/profile/add-address')}
            activeOpacity={0.7}
          >
            <View style={styles.addIconWrap}>
              <Ionicons name="add" size={20} color="#2E7AD9" />
            </View>
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 8 : 0,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(46, 122, 217, 0.12)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  listContent: {
    padding: 20,
    paddingBottom: 32,
    flexGrow: 1,
    gap: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    overflow: 'hidden',
    marginBottom: 4,
  },
  cardDefault: {
    borderColor: 'rgba(46, 122, 217, 0.35)',
    backgroundColor: '#F8FBFF',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E8F1FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleDefault: {
    backgroundColor: '#2E7AD9',
  },
  info: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  starBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  starBtnActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  label: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  defaultChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  defaultChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7AD9',
  },
  fullAddress: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15, 23, 42, 0.06)',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
  },
  setDefaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(46, 122, 217, 0.08)',
  },
  setDefaultText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7AD9',
  },
  setDefaultBtnDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  setDefaultTextDisabled: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  footerBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  footerDivider: {
    width: StyleSheet.hairlineWidth,
    height: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.12)',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 56,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8F1FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(46, 122, 217, 0.3)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
  },
  addIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
});
