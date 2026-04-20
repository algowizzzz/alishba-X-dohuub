import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal as RNModal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
 * Location Modal — exact match to boss wireframe (LocationSelectorModal.tsx):
 * - Bottom sheet style (slides up from bottom)
 * - "Select Service Location" title with X close
 * - Address cards with MapPin, label, Default badge, checkmark
 * - Blue gradient "Add New Address" button
 */
export function LocationModal({
  visible,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNew,
}: LocationModalProps) {
  const handleSelectAddress = (address: Address) => {
    onSelectAddress(address);
    onClose();
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Select Service Location</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Address List */}
              <ScrollView
                style={styles.addressList}
                showsVerticalScrollIndicator={false}
              >
                {addresses.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="location" size={48} color="#2E7AD9" />
                    <Text style={styles.emptyTitle}>No saved addresses</Text>
                    <Text style={styles.emptySubtitle}>Add an address to get started</Text>
                  </View>
                ) : (
                  addresses.map((address) => {
                    const isSelected = selectedAddressId === address.id;
                    return (
                      <TouchableOpacity
                        key={address.id}
                        style={[
                          styles.addressCard,
                          isSelected && styles.addressCardSelected,
                        ]}
                        onPress={() => handleSelectAddress(address)}
                      >
                        <View style={styles.addressRow}>
                          <Ionicons
                            name="location"
                            size={20}
                            color={isSelected ? '#2E7AD9' : '#64748B'}
                            style={styles.pinIcon}
                          />
                          <View style={styles.addressInfo}>
                            <View style={styles.addressLabelRow}>
                              <Text style={styles.addressLabel}>{address.label}</Text>
                              {address.isDefault && (
                                <View style={styles.defaultBadge}>
                                  <Text style={styles.defaultBadgeText}>Default</Text>
                                </View>
                              )}
                              {isSelected && (
                                <Text style={styles.checkmark}>✓</Text>
                              )}
                            </View>
                            <Text style={styles.addressText}>{address.address}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>

              {/* Add New Address Button */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    onAddNew();
                    onClose();
                  }}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>Add New Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    padding: 8,
  },
  addressList: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  addressCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  addressCardSelected: {
    borderWidth: 2,
    borderColor: '#2E7AD9',
    backgroundColor: '#E3F0FF',
    borderLeftWidth: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pinIcon: {
    marginTop: 2,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  defaultBadge: {
    backgroundColor: '#E3F0FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#2E7AD9',
    fontWeight: '500',
  },
  checkmark: {
    marginLeft: 'auto',
    fontSize: 18,
    color: '#2E7AD9',
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2E7AD9',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#2E7AD9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
