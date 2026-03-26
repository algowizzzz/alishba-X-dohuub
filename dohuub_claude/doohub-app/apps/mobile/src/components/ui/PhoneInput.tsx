import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, borderWidth } from '../../constants/theme';

const COUNTRY_CODES = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
];

interface PhoneInputProps {
  label?: string;
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (number: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

/**
 * PhoneInput component matching wireframe with country code dropdown
 */
export function PhoneInput({
  label,
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  placeholder = '(555) 123-4567',
  error,
  required,
}: PhoneInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  const renderCountryItem = ({ item }: { item: typeof COUNTRY_CODES[0] }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        onCountryCodeChange(item.code);
        setShowPicker(false);
      }}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <Text style={styles.countryCode}>{item.code}</Text>
      <Text style={styles.countryName}>{item.country}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={styles.inputRow}>
        {/* Country Code Selector */}
        <TouchableOpacity
          style={[styles.codeSelector, isFocused && styles.codeSelectorFocused]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.codeText}>{selectedCountry.code}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.text.secondary} />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          style={[
            styles.phoneInput,
            isFocused && styles.phoneInputFocused,
            error && styles.inputError,
          ]}
          value={phoneNumber}
          onChangeText={onPhoneNumberChange}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          keyboardType="phone-pad"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Country Picker Modal */}
      <Modal visible={showPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRY_CODES}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.text.primary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  codeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
    minHeight: 52,
  },
  codeSelectorFocused: {
    borderColor: colors.primary,
  },
  codeText: {
    fontSize: fontSize.md,
    color: colors.primary,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    fontSize: fontSize.md,
    color: colors.text.primary,
    minHeight: 52,
  },
  phoneInputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.status.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46, 122, 217, 0.05)',
    gap: spacing.md,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryCode: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.primary,
    width: 50,
  },
  countryName: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
});

