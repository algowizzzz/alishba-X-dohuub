import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { supabase } from '../../src/lib/supabase';

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
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(addressId) },
    ]);
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (userId) {
        // Clear previous default
        await supabase
          .from('Address')
          .update({ isDefault: false, updatedAt: new Date().toISOString() })
          .eq('userId', userId);
        // Set new default
        await supabase
          .from('Address')
          .update({ isDefault: true, updatedAt: new Date().toISOString() })
          .eq('id', addressId);
      }
      setSelectedAddress(addressId);
      if (fetchAddresses) fetchAddresses();
    } catch {
      // fallback: just update selected
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
            <Ionicons name={icon} size={22} color={colors.primary} />
          </View>

          <View style={styles.info}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{item.label || item.type}</Text>
              {isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              )}
            </View>
            <Text style={styles.street}>{item.street}</Text>
            <Text style={styles.city}>{item.city}, {item.state} {item.zipCode}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item.id)}>
              <Ionicons name="create-outline" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={20} color={colors.status.error} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleSetDefault(item.id)}>
              <Ionicons
                name={isDefault ? 'star' : 'star-outline'}
                size={20}
                color={isDefault ? colors.primary : colors.text.secondary}
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
        <Ionicons name="location-outline" size={48} color={colors.text.muted} />
      </View>
      <Text style={styles.emptyTitle}>No addresses saved</Text>
      <Text style={styles.emptyText}>Add your frequently used addresses for faster booking</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Saved Addresses" showBack />

      <FlatList
        data={addresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/profile/add-address')}>
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, flexGrow: 1 },

  card: {
    flexDirection: 'row',
    borderWidth: borderWidth.default,
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  cardDefault: {
    borderColor: 'rgba(46,122,217,0.25)',
  },
  accentBorder: {
    width: 4,
    backgroundColor: colors.primary,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  street: { fontSize: fontSize.sm, color: colors.text.secondary },
  city: { fontSize: fontSize.sm, color: colors.text.secondary },

  actions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  actionBtn: { padding: spacing.sm },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 260,
  },

  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46,122,217,0.1)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(46,122,217,0.03)',
  },
  addButtonText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.primary,
  },
});
