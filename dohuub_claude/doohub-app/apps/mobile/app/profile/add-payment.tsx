import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/store/authStore';

function detectCardType(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.startsWith('4')) return 'VISA';
  if (cleaned.startsWith('5')) return 'MASTERCARD';
  if (cleaned.startsWith('3')) return 'AMEX';
  return 'VISA';
}

function getCardTypeLabel(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.startsWith('4')) return 'Visa';
  if (cleaned.startsWith('5')) return 'Mastercard';
  if (cleaned.startsWith('3')) return 'Amex';
  return 'Card';
}

export default function AddPaymentScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 16);
    const formatted = limited.match(/.{1,4}/g)?.join(' ') || limited;
    return formatted;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleCardholderChange = (text: string) => {
    setCardholderName(text.toUpperCase());
    if (errors.cardholderName) {
      setErrors({ ...errors, cardholderName: '' });
    }
  };

  const handleExpiryChange = (text: string) => {
    setExpiry(formatExpiry(text));
    if (errors.expiry) {
      setErrors({ ...errors, expiry: '' });
    }
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    setCvv(cleaned);
    if (errors.cvv) {
      setErrors({ ...errors, cvv: '' });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const cardDigits = cardNumber.replace(/\s/g, '');

    if (!cardDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardDigits.length < 13 || cardDigits.length > 16) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!expiry || expiry.length < 5) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      const [monthStr, yearStr] = expiry.split('/');
      const month = parseInt(monthStr);
      const year = parseInt(yearStr);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiry = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }

    if (!cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = async () => {
    if (!validateForm()) return;

    setIsAdding(true);
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Not authenticated');

      const cleanedNumber = cardNumber.replace(/\s/g, '');
      const [monthStr, yearStr] = expiry.split('/');

      const { error } = await supabase.from('PaymentMethod').insert({
        id: `pm-${Date.now()}`,
        userId,
        type: detectCardType(cardNumber),
        last4: cleanedNumber.slice(-4),
        expiryMonth: parseInt(monthStr),
        expiryYear: 2000 + parseInt(yearStr),
        isDefault: isDefault,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (error) throw error;

      router.back();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to add card. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const getDisplayCardNumber = () => {
    if (cardNumber) return cardNumber;
    return '\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022';
  };

  const getDisplayExpiry = () => {
    if (expiry && expiry.length >= 4) return expiry;
    return 'MM/YY';
  };

  const getBorderColor = (field: string) => {
    if (errors[field]) return '#EF4444';
    if (focusedField === field) return '#2E7AD9';
    return 'rgba(46, 122, 217, 0.15)';
  };

  const getBorderWidth = (field: string) => {
    if (errors[field]) return 2;
    if (focusedField === field) return 2;
    return 1;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7FF" />

      {/* Glassmorphic Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Payment Card</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Card Preview */}
        <LinearGradient
          colors={['#2E7AD9', '#1E6BC9']}
          style={styles.cardPreview}
        >
          <View style={styles.cardPreviewTop}>
            <Ionicons name="card" size={40} color="#FFFFFF" />
            <Text style={styles.cardTypeLabel}>{getCardTypeLabel(cardNumber)}</Text>
          </View>
          <Text style={styles.cardPreviewNumber}>
            {getDisplayCardNumber()}
          </Text>
          <View style={styles.cardPreviewBottom}>
            <View>
              <Text style={styles.cardPreviewLabel}>Cardholder Name</Text>
              <Text style={styles.cardPreviewValue}>
                {cardholderName || 'FULL NAME'}
              </Text>
            </View>
            <View>
              <Text style={styles.cardPreviewLabel}>Expires</Text>
              <Text style={styles.cardPreviewValue}>{getDisplayExpiry()}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Card Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Number *</Text>
          <View style={[
            styles.inputContainer,
            { borderColor: getBorderColor('cardNumber'), borderWidth: getBorderWidth('cardNumber') },
          ]}>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#94A3B8"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              onFocus={() => setFocusedField('cardNumber')}
              onBlur={() => setFocusedField(null)}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>
          {errors.cardNumber ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={14} color="#EF4444" />
              <Text style={styles.errorText}>{errors.cardNumber}</Text>
            </View>
          ) : null}
        </View>

        {/* Cardholder Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cardholder Name *</Text>
          <View style={[
            styles.inputContainer,
            { borderColor: getBorderColor('cardholderName'), borderWidth: getBorderWidth('cardholderName') },
          ]}>
            <TextInput
              style={styles.input}
              placeholder="JOHN DOE"
              placeholderTextColor="#94A3B8"
              value={cardholderName}
              onChangeText={handleCardholderChange}
              onFocus={() => setFocusedField('cardholderName')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="characters"
            />
          </View>
          {errors.cardholderName ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={14} color="#EF4444" />
              <Text style={styles.errorText}>{errors.cardholderName}</Text>
            </View>
          ) : null}
        </View>

        {/* Expiry Date and CVV Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Expiry Date *</Text>
            <View style={[
              styles.inputContainer,
              { borderColor: getBorderColor('expiry'), borderWidth: getBorderWidth('expiry') },
            ]}>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#94A3B8"
                value={expiry}
                onChangeText={handleExpiryChange}
                onFocus={() => setFocusedField('expiry')}
                onBlur={() => setFocusedField(null)}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            {errors.expiry ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.errorText}>{errors.expiry}</Text>
              </View>
            ) : null}
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>CVV *</Text>
            <View style={[
              styles.inputContainer,
              { borderColor: getBorderColor('cvv'), borderWidth: getBorderWidth('cvv') },
            ]}>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#94A3B8"
                value={cvv}
                onChangeText={handleCvvChange}
                onFocus={() => setFocusedField('cvv')}
                onBlur={() => setFocusedField(null)}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
            {errors.cvv ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.errorText}>{errors.cvv}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Set as Default checkbox */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setIsDefault(!isDefault)}
          activeOpacity={0.7}
        >
          <View style={[
            styles.checkbox,
            isDefault && styles.checkboxChecked,
          ]}>
            {isDefault && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Set as default payment method</Text>
        </TouchableOpacity>

        {/* Secured by Stripe */}
        <LinearGradient
          colors={['#2E7AD9', '#1E6BC9']}
          style={styles.stripeBox}
        >
          <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
          <Text style={styles.stripeText}>Secured by Stripe</Text>
        </LinearGradient>

        {/* Add Card Button */}
        <TouchableOpacity
          onPress={handleAddCard}
          disabled={isAdding}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#2E7AD9', '#1E6BC9']}
            style={[styles.addCardBtn, isAdding && { opacity: 0.6 }]}
          >
            <Text style={styles.addCardBtnText}>
              {isAdding ? 'Adding...' : 'Add Card'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
  },
  headerInner: {
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
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  cardPreview: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardPreviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 48,
  },
  cardTypeLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  cardPreviewNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 24,
  },
  cardPreviewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardPreviewLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  cardPreviewValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.15)',
  },
  input: {
    padding: 16,
    fontSize: 15,
    color: '#1E293B',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.2)',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2E7AD9',
    borderColor: '#2E7AD9',
    borderWidth: 0,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#1E293B',
  },
  stripeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  stripeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  addCardBtn: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addCardBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
