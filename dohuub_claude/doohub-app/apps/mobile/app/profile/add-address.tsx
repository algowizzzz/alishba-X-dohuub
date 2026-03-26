import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button } from '../../src/components/ui';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/store/authStore';

type AddressType = 'Home' | 'Work' | 'Other';

const ADDRESS_TYPES: { type: AddressType; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: 'Home', icon: 'home' },
  { type: 'Work', icon: 'briefcase' },
  { type: 'Other', icon: 'location' },
];

export default function AddAddressScreen() {
  const { type, edit } = useLocalSearchParams<{ type?: string; edit?: string }>();
  const isEditing = edit === 'true';

  const [addressType, setAddressType] = useState<AddressType>((type as AddressType) || 'Home');
  const [country, setCountry] = useState('United States');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isFormValid = street.trim() && city.trim() && state.trim() && zipCode.trim();

  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const userId = useAuthStore.getState().user?.id;

      if (userId) {
        const { error } = await supabase.from('Address').insert({
          id: `addr-${Date.now()}`,
          userId,
          type: addressType.toUpperCase(),
          label: addressType,
          street,
          city,
          state,
          zipCode,
          country,
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        if (error) throw error;
      }

      // Navigate back regardless (works in dev without auth too)
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(auth)/address-setup');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={isEditing ? 'Edit Address' : 'Add Address'} showBack />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Address Type */}
          <Text style={styles.sectionTitle}>Address Type</Text>
          <View style={styles.typeSelector}>
            {ADDRESS_TYPES.map(({ type: t, icon }) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeOption, addressType === t && styles.typeOptionActive]}
                onPress={() => setAddressType(t)}
              >
                <Ionicons
                  name={icon}
                  size={20}
                  color={addressType === t ? '#FFFFFF' : colors.text.secondary}
                />
                <Text style={[styles.typeText, addressType === t && styles.typeTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Country */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Country</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="United States"
              placeholderTextColor={colors.text.muted}
            />
          </View>

          {/* Street Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Street Address</Text>
            <TextInput
              style={styles.input}
              value={street}
              onChangeText={setStreet}
              placeholder="123 Main Street, Apt 4B"
              placeholderTextColor={colors.text.muted}
              autoCapitalize="words"
            />
          </View>

          {/* City */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="New York"
              placeholderTextColor={colors.text.muted}
              autoCapitalize="words"
            />
          </View>

          {/* State + Zip */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>State</Text>
              <TextInput
                style={styles.input}
                value={state}
                onChangeText={setState}
                placeholder="NY"
                placeholderTextColor={colors.text.muted}
                autoCapitalize="characters"
                maxLength={2}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Zip Code</Text>
              <TextInput
                style={styles.input}
                value={zipCode}
                onChangeText={setZipCode}
                placeholder="10001"
                placeholderTextColor={colors.text.muted}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Delivery Instructions */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Delivery Instructions (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={deliveryInstructions}
              onChangeText={setDeliveryInstructions}
              placeholder="e.g., Ring doorbell twice, Leave at door"
              placeholderTextColor={colors.text.muted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={styles.ctaContainer}>
          <Button
            title="Save Address"
            onPress={handleSave}
            loading={isSaving}
            fullWidth
            disabled={!isFormValid}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  typeOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text.primary,
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.text.secondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  ctaContainer: {
    padding: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
});
