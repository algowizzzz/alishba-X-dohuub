import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { colors, spacing, borderRadius, fontSize, fontWeight, borderWidth } from '../../constants/theme';

interface Address {
  id: string;
  type: 'home' | 'work' | 'doctor' | 'pharmacy' | 'other';
  label: string;
  address: string;
  isDefault?: boolean;
}

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedAddressId?: string;
  onSelectAddress: (address: Address) => void;
  onAddNew: () => void;
  onUseCurrentLocation?: () => void;
}

/**
 * Location Modal matching wireframes
 * - Location search/input
 * - Current location option
 * - Saved addresses list
 * - Add new address button
 */
export function LocationModal({
  visible,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNew,
  onUseCurrentLocation,
}: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getTypeIcon = (type: Address['type']): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'home':
        return 'home-outline';
      case 'work':
        return 'briefcase-outline';
      case 'doctor':
        return 'medkit-outline';
      case 'pharmacy':
        return 'medical-outline';
      default:
        return 'location-outline';
    }
  };

  const filteredAddresses = searchQuery
    ? addresses.filter(
        (addr) =>
          addr.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          addr.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : addresses;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Select Location"
      size="lg"
    >
      {/* Search Input */}
      <Input
        placeholder="Search for an address..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Ionicons name="search" size={20} color={colors.text.muted} />}
        containerStyle={styles.searchInput}
      />

      {/* Current Location */}
      {onUseCurrentLocation && (
        <TouchableOpacity
          style={styles.currentLocation}
          onPress={() => {
            onUseCurrentLocation();
            onClose();
          }}
        >
          <View style={styles.locationIcon}>
            <Ionicons name="navigate" size={20} color={colors.primary} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Use Current Location</Text>
            <Text style={styles.locationAddress}>GPS location</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
        </TouchableOpacity>
      )}

      {/* Saved Addresses */}
      <Text style={styles.sectionTitle}>Saved Addresses</Text>
      <ScrollView style={styles.addressList} showsVerticalScrollIndicator={false}>
        {filteredAddresses.map((address) => (
          <TouchableOpacity
            key={address.id}
            style={[
              styles.addressItem,
              selectedAddressId === address.id && styles.addressItemSelected,
            ]}
            onPress={() => {
              onSelectAddress(address);
              onClose();
            }}
          >
            <View style={styles.addressIcon}>
              <Ionicons
                name={getTypeIcon(address.type)}
                size={20}
                color={colors.text.secondary}
              />
            </View>
            <View style={styles.addressInfo}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressLabel}>{address.label}</Text>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText} numberOfLines={2}>
                {address.address}
              </Text>
            </View>
            {selectedAddressId === address.id && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add New Address */}
      <Button
        title="Add New Address"
        variant="outline"
        onPress={() => {
          onAddNew();
          onClose();
        }}
        icon={<Ionicons name="add" size={20} color={colors.primary} />}
        fullWidth
        style={styles.addButton}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    marginBottom: spacing.md,
  },
  currentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46, 122, 217, 0.1)',
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  locationAddress: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  addressList: {
    maxHeight: 250,
    marginBottom: spacing.md,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46, 122, 217, 0.1)',
  },
  addressItemSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  defaultBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.background,
  },
  addressText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  addButton: {
    marginTop: spacing.sm,
  },
});

