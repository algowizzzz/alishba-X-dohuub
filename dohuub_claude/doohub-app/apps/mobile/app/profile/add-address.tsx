import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { searchAddresses, ParsedAddress } from '../../src/services/geocoding';

type AddressType = 'Home' | 'Work' | 'Other';

const ADDRESS_TYPES: { type: AddressType; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: 'Home', icon: 'home' },
  { type: 'Work', icon: 'briefcase' },
  { type: 'Other', icon: 'location' },
];

function mapTypeToUi(type?: string): AddressType {
  const t = (type || '').toUpperCase();
  if (t === 'WORK') return 'Work';
  if (t === 'OTHER') return 'Other';
  return 'Home';
}

export default function AddAddressScreen() {
  // Prefill params come from manual.tsx after a Nominatim suggestion is
  // picked or "Use current location" succeeds. Fall back to empty for the
  // bare-form entry case. Edit mode loads from the store by `id`.
  const params = useLocalSearchParams<{
    id?: string;
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
  const isEditing = params.edit === 'true' && !!params.id;
  const addresses = useAuthStore((s) => s.addresses);
  const existing = isEditing ? addresses.find((a) => a.id === params.id) : undefined;

  const [addressType, setAddressType] = useState<AddressType>(
    mapTypeToUi(existing?.type || params.type)
  );
  const [label, setLabel] = useState<string>(
    existing?.label || (params.type as string) || 'Home'
  );
  const [country, setCountry] = useState(existing?.country || params.country || 'United States');
  const [street, setStreet] = useState(existing?.street || params.street || '');
  const [city, setCity] = useState(existing?.city || params.city || '');
  const [state, setState] = useState(existing?.state || params.state || '');
  const [zipCode, setZipCode] = useState(existing?.zipCode || params.zipCode || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<ParsedAddress[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [coords, setCoords] = useState<{ latitude?: number; longitude?: number }>({
    latitude: existing?.latitude ?? (params.latitude ? parseFloat(params.latitude) : undefined),
    longitude: existing?.longitude ?? (params.longitude ? parseFloat(params.longitude) : undefined),
  });
  const [isDefault, setIsDefault] = useState(!!existing?.isDefault);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRequestRef = useRef(0);
  const selectingSuggestionRef = useRef(false);
  const hydratedRef = useRef(false);

  // Prefill when store address becomes available (edit mode)
  useEffect(() => {
    if (!isEditing || !params.id || hydratedRef.current) return;

    const addr = addresses.find((a) => a.id === params.id);
    if (!addr) {
      // Ensure addresses are loaded, then hydrate on next run
      useAuthStore.getState().fetchAddresses();
      return;
    }

    hydratedRef.current = true;
    setAddressType(mapTypeToUi(addr.type));
    setLabel(addr.label || mapTypeToUi(addr.type));
    setStreet(addr.street || '');
    setCity(addr.city || '');
    setState(addr.state || '');
    setZipCode(addr.zipCode || '');
    setCountry(addr.country || 'United States');
    setIsDefault(!!addr.isDefault);
    setCoords({
      latitude: addr.latitude,
      longitude: addr.longitude,
    });
  }, [isEditing, params.id, addresses]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const handleStreetChange = (query: string) => {
    setStreet(query);
    // Clear coords when user types manually after a suggestion pick
    setCoords({});

    if (selectingSuggestionRef.current) {
      selectingSuggestionRef.current = false;
      return;
    }

    if (query.trim().length < 3) {
      setShowSuggestions(false);
      setSuggestions([]);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const requestId = ++lastRequestRef.current;
      setIsSearching(true);
      const results = await searchAddresses(query);
      if (requestId === lastRequestRef.current) {
        setSuggestions(results);
        setIsSearching(false);
      }
    }, 400);
  };

  const handleSelectSuggestion = (suggestion: ParsedAddress) => {
    selectingSuggestionRef.current = true;
    setStreet(suggestion.street || suggestion.displayName.split(',')[0] || '');
    setCity(suggestion.city || '');
    setState(suggestion.state || '');
    setZipCode(suggestion.zipCode || '');
    if (suggestion.country) setCountry(suggestion.country);
    setCoords({
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
    setShowSuggestions(false);
    setSuggestions([]);
    setFocusedField(null);
  };

  const isFormValid = street.trim() && city.trim() && state.trim() && zipCode.trim() && country.trim();

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!isFormValid) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const type = addressType.toUpperCase() as 'HOME' | 'WORK' | 'OTHER';
      const payload = {
        type,
        label: addressType === 'Other' ? label.trim() || 'Other' : addressType,
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        country: country.trim(),
        isDefault,
        ...(coords.latitude !== undefined &&
          Number.isFinite(coords.latitude) && { latitude: coords.latitude }),
        ...(coords.longitude !== undefined &&
          Number.isFinite(coords.longitude) && { longitude: coords.longitude }),
      };

      if (isEditing && params.id) {
        await useAuthStore.getState().updateAddress(params.id, payload);
      } else {
        await useAuthStore.getState().addAddress(payload);
      }

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(auth)/address-setup');
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to save address. Please try again.';
      Alert.alert('Error', message);
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
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

          <View style={[styles.fieldGroup, { zIndex: 10 }]}>
            <Text style={styles.fieldLabel}>Street Address</Text>
            <View style={styles.streetInputWrap}>
              <TextInput
                style={[...getInputStyle('street'), styles.streetInput]}
                value={street}
                onChangeText={handleStreetChange}
                placeholder="Start typing an address..."
                placeholderTextColor="#94A3B8"
                autoCapitalize="words"
                onFocus={() => {
                  setFocusedField('street');
                  if (street.trim().length >= 3 && suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setFocusedField(null);
                    setShowSuggestions(false);
                  }, 200);
                }}
              />
              {isSearching && (
                <ActivityIndicator
                  size="small"
                  color="#2E7AD9"
                  style={styles.streetSpinner}
                />
              )}
            </View>

            {showSuggestions && focusedField === 'street' && (
              <View style={styles.suggestionsBox}>
                {isSearching && suggestions.length === 0 ? (
                  <View style={styles.suggestionEmpty}>
                    <Text style={styles.suggestionEmptyText}>Searching...</Text>
                  </View>
                ) : suggestions.length === 0 ? (
                  <View style={styles.suggestionEmpty}>
                    <Text style={styles.suggestionEmptyText}>No matches found</Text>
                  </View>
                ) : (
                  suggestions.map((item, index) => (
                    <TouchableOpacity
                      key={`${item.latitude}-${item.longitude}-${index}`}
                      style={[
                        styles.suggestionItem,
                        index < suggestions.length - 1 && styles.suggestionItemBorder,
                      ]}
                      onPress={() => handleSelectSuggestion(item)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="location-outline" size={18} color="#2E7AD9" />
                      <Text style={styles.suggestionText} numberOfLines={2}>
                        {item.displayName}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
            <Text style={styles.hintText}>Type at least 3 characters for address suggestions</Text>
          </View>

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
                maxLength={30}
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
      </KeyboardAvoidingView>

      {/* Pinned to screen bottom — does not jump with keyboard */}
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
                  <Text style={styles.saveButtonText}>
                    {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Save Address'}
                  </Text>
              )}
            </LinearGradient>
          ) : (
            <View style={[styles.saveButton, styles.saveButtonDisabled]}>
              <Text style={styles.saveButtonTextDisabled}>
                {isEditing ? 'Save Changes' : 'Save Address'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
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
  streetInputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  streetInput: {
    paddingRight: 44,
  },
  streetSpinner: {
    position: 'absolute',
    right: 14,
  },
  suggestionsBox: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.2)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  suggestionItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(46, 122, 217, 0.12)',
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
  },
  suggestionEmpty: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  suggestionEmptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  hintText: {
    marginTop: 6,
    fontSize: 12,
    color: '#94A3B8',
  },
  textArea: {
    height: 88,
    paddingTop: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
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
