import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader } from '../../../src/components/composite';
import { Button, Input } from '../../../src/components/ui';
import { useAuthStore } from '../../../src/store/authStore';
import { ConfirmModal } from '../../../src/components/modals';
import { supabase } from '../../../src/lib/supabase';

const ADDRESS_TYPES = ['Home', 'Work', 'Other'];

/**
 * Edit Address Screen matching wireframe:
 * - Pre-filled address form
 * - Address type selector (Home/Work/Other)
 * - Map pin adjustment (optional)
 * - "Save Changes" button
 * - "Delete Address" button
 */
export default function EditAddressScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addresses, updateAddress, deleteAddress } = useAuthStore();
  const address = addresses.find(a => a.id === id);

  const [label, setLabel] = useState(address?.label || '');
  const [street, setStreet] = useState(address?.street || '');
  const [city, setCity] = useState(address?.city || '');
  const [state, setState] = useState(address?.state || '');
  const [zipCode, setZipCode] = useState(address?.zipCode || '');
  const [addressType, setAddressType] = useState(address?.type || 'Home');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (address) {
      setLabel(address.label);
      setStreet(address.street);
      setCity(address.city);
      setState(address.state);
      setZipCode(address.zipCode);
      setAddressType(address.type);
    }
  }, [address]);

  const handleSave = async () => {
    if (!street || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('Address')
        .update({
          type: addressType.toUpperCase(),
          label: label || addressType,
          street,
          city,
          state,
          zipCode,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Also update local store
      updateAddress(id!, {
        type: addressType.toUpperCase() as any,
        label: label || addressType,
        street,
        city,
        state,
        zipCode,
      });

      router.back();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('Address')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Also remove from local store
      await deleteAddress(id!);
      setShowDeleteModal(false);
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to delete address');
    }
  };

  if (!address) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Edit Address" showBack />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Address not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Edit Address" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Address Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Address Type</Text>
          <View style={styles.typeSelector}>
            {ADDRESS_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  addressType === type && styles.typeOptionActive,
                ]}
                onPress={() => setAddressType(type)}
              >
                <Ionicons
                  name={
                    type === 'Home' ? 'home-outline' :
                    type === 'Work' ? 'briefcase-outline' : 'location-outline'
                  }
                  size={20}
                  color={addressType === type ? colors.text.inverse : colors.text.secondary}
                />
                <Text
                  style={[
                    styles.typeText,
                    addressType === type && styles.typeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Label */}
        <View style={styles.section}>
          <Text style={styles.label}>Label (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., My Apartment"
            placeholderTextColor={colors.text.muted}
            value={label}
            onChangeText={setLabel}
          />
        </View>

        {/* Street Address */}
        <View style={styles.section}>
          <Text style={styles.label}>Street Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="123 Main Street, Apt 4B"
            placeholderTextColor={colors.text.muted}
            value={street}
            onChangeText={setStreet}
          />
        </View>

        {/* City */}
        <View style={styles.section}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            placeholder="New York"
            placeholderTextColor={colors.text.muted}
            value={city}
            onChangeText={setCity}
          />
        </View>

        {/* State & Zip Row */}
        <View style={styles.row}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              style={styles.input}
              placeholder="NY"
              placeholderTextColor={colors.text.muted}
              value={state}
              onChangeText={setState}
            />
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>Zip Code *</Text>
            <TextInput
              style={styles.input}
              placeholder="10001"
              placeholderTextColor={colors.text.muted}
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Save Button */}
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={isSaving}
          fullWidth
          style={styles.saveButton}
        />

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setShowDeleteModal(true)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.status.error} />
          <Text style={styles.deleteText}>Delete Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
      />
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
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  typeOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  typeTextActive: {
    color: colors.text.inverse,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
  },
  deleteText: {
    fontSize: fontSize.md,
    color: colors.status.error,
  },
});

