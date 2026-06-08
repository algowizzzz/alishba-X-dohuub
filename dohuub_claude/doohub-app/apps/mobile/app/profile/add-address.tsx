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
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';

type AddressType = 'Home' | 'Work' | 'Other';

const ADDRESS_TYPES: { type: AddressType; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: 'Home', icon: 'home' },
  { type: 'Work', icon: 'briefcase' },
  { type: 'Other', icon: 'location' },
];

export default function AddAddressScreen() {
  // Prefill params come from manual.tsx after a Nominatim suggestion is
  // picked or "Use current location" succeeds. Fall back to empty for the
  // bare-form entry case.
  const params = useLocalSearchParams<{
    type?: string;
    edit?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    latitude?: string;
    longitude?: string;
  }>();
  const isEditing = params.edit === 'true';

  const [addressType, setAddressType] = useState<AddressType>((params.type as AddressType) || 'Home');
  const [label, setLabel] = useState<string>((params.type as string) || 'Home');
  const [country, setCountry] = useState(params.country || 'United States');
  const [street, setStreet] = useState(params.street || '');
  const [city, setCity] = useState(params.city || '');
  const [state, setState] = useState(params.state || '');
  const [zipCode, setZipCode] = useState(params.zipCode || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const prefilledLat = params.latitude ? parseFloat(params.latitude) : undefined;
  const prefilledLon = params.longitude ? parseFloat(params.longitude) : undefined;

  const isFormValid = street.trim() && city.trim() && state.trim() && zipCode.trim() && country.trim();

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
          label: addressType === 'Other' ? label : addressType,
          street,
          city,
          state,
          zipCode,
          country,
          ...(prefilledLat !== undefined && Number.isFinite(prefilledLat) && { latitude: prefilledLat }),
          ...(prefilledLon !== undefined && Number.isFinite(prefilledLon) && { longitude: prefilledLon }),
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        if (error) throw error;
      }

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

  const getInputStyle = (field: string) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

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
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Address' : 'Add Address'}</Text>
        </View>
      </View>

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
          <Text style={styles.sectionLabel}>Address Type</Text>
          <View style={styles.typeSelector}>
            {ADDRESS_TYPES.map(({ type: t, icon }) => {
              const isActive = addressType === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeOption, isActive && styles.typeOptionActive]}
                  onPress={() => {
                    setAddressType(t);
                    if (label === addressType) setLabel(t);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={icon}
                    size={24}
                    color={isActive ? '#2E7AD9' : '#64748B'}
                  />
                  <Text style={[styles.typeText, isActive && styles.typeTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Label (only for Other) */}
          {addressType === 'Other' && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Label</Text>
              <TextInput
                style={getInputStyle('label')}
                value={label}
                onChangeText={setLabel}
                placeholder="e.g., Mom's House, Gym"
                placeholderTextColor="#94A3B8"
                onFocus={() => setFocusedField('label')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          )}

          {/* Country */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Country</Text>
            <TextInput
              style={getInputStyle('country')}
              value={country}
              onChangeText={setCountry}
              placeholder="United States"
              placeholderTextColor="#94A3B8"
              onFocus={() => setFocusedField('country')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Street Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Street Address</Text>
            <TextInput
              style={getInputStyle('street')}
              value={street}
              onChangeText={setStreet}
              placeholder="123 Main Street, Apt 4B"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
              onFocus={() => setFocusedField('street')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* City */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>City</Text>
            <TextInput
              style={getInputStyle('city')}
              value={city}
              onChangeText={setCity}
              placeholder="New York"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
              onFocus={() => setFocusedField('city')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* State + Zip */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>State</Text>
              <TextInput
                style={getInputStyle('state')}
                value={state}
                onChangeText={setState}
                placeholder="NY"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                maxLength={2}
                onFocus={() => setFocusedField('state')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Zip Code</Text>
              <TextInput
                style={getInputStyle('zipCode')}
                value={zipCode}
                onChangeText={setZipCode}
                placeholder="10001"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={10}
                onFocus={() => setFocusedField('zipCode')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Delivery Instructions */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Delivery Instructions (Optional)</Text>
            <TextInput
              style={[...getInputStyle('instructions'), styles.textArea]}
              value={deliveryInstructions}
              onChangeText={setDeliveryInstructions}
              placeholder="e.g., Ring doorbell twice, Leave at door"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              onFocus={() => setFocusedField('instructions')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isFormValid || isSaving}
            activeOpacity={0.8}
            style={styles.saveButtonWrapper}
          >
            {isFormValid ? (
              <LinearGradient
                colors={['#2E7AD9', '#1E6AC9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.saveButton, isSaving && { opacity: 0.7 }]}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Address</Text>
                )}
              </LinearGradient>
            ) : (
              <View style={[styles.saveButton, styles.saveButtonDisabled]}>
                <Text style={styles.saveButtonTextDisabled}>Save Address</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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

  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 32,
  },

  // Address Type Selector
  sectionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'rgba(46, 122, 217, 0.15)',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  typeOptionActive: {
    backgroundColor: '#E8F1FC',
    borderColor: '#2E7AD9',
    shadowColor: '#2E7AD9',
    shadowOpacity: 0.12,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  typeTextActive: {
    color: '#2E7AD9',
    fontWeight: '600',
  },

  // Form Fields
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: 'rgba(46, 122, 217, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  inputFocused: {
    borderColor: '#2E7AD9',
    shadowColor: '#2E7AD9',
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  textArea: {
    height: 88,
    paddingTop: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },

  // CTA
  ctaContainer: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
  saveButtonWrapper: {
    width: '100%',
  },
  saveButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7AD9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButtonTextDisabled: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
