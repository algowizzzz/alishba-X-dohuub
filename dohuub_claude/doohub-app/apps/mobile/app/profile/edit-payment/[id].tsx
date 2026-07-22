import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ConfirmModal } from '../../../src/components/modals';
import api from '../../../src/services/api';

function detectCardType(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.startsWith('4')) return 'visa';
  if (cleaned.startsWith('5')) return 'mastercard';
  if (cleaned.startsWith('3')) return 'amex';
  return 'card';
}

function getCardName(type: string) {
  switch ((type || '').toLowerCase()) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'Mastercard';
    case 'amex':
      return 'Amex';
    default:
      return 'Card';
  }
}

export default function EditPaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [originalLast4, setOriginalLast4] = useState('');
  const [cardBrand, setCardBrand] = useState('card');
  const [expiry, setExpiry] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<{ success: boolean; data?: any[] }>('/payments/methods');
        const methods = response?.data || [];
        const data = methods.find((pm) => pm.id === id);

        if (!data) {
          setNotFound(true);
          return;
        }

        const brand = String(data.brand || data.type || 'card').toLowerCase();
        const last4 = data.last4 || '';
        setOriginalLast4(last4);
        setCardBrand(brand);
        setCardNumber(`•••• •••• •••• ${last4}`);
        setExpiry(
          data.expiryMonth && data.expiryYear
            ? `${String(data.expiryMonth).padStart(2, '0')}/${String(data.expiryYear).slice(-2)}`
            : ''
        );
        setIsDefault(!!data.isDefault);
      } catch (error) {
        console.error('Failed to fetch card:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 16);
    return limited.match(/.{1,4}/g)?.join(' ') || limited;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    // If user starts typing over the masked value, replace with digits only
    if (text.includes('•')) {
      const digits = text.replace(/[•\s]/g, '').replace(/\D/g, '');
      setCardNumber(formatCardNumber(digits));
    } else {
      setCardNumber(formatCardNumber(text));
    }
    if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
  };

  const handleExpiryChange = (text: string) => {
    setExpiry(formatExpiry(text));
    if (errors.expiry) setErrors({ ...errors, expiry: '' });
  };

  const getEffectiveLast4 = () => {
    const digits = cardNumber.replace(/\D/g, '').replace(/•/g, '');
    if (digits.length >= 4) return digits.slice(-4);
    return originalLast4;
  };

  const getEffectiveBrand = () => {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length >= 1 && !cardNumber.includes('•')) {
      return detectCardType(cardNumber);
    }
    return cardBrand;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const digits = cardNumber.replace(/\D/g, '');
    const isMasked = cardNumber.includes('•');

    if (!isMasked && digits.length > 0 && (digits.length < 13 || digits.length > 16)) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!expiry || expiry.length < 5) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      const [monthStr, yearStr] = expiry.split('/');
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiry = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!id || !validateForm()) return;

    setIsSaving(true);
    try {
      const [monthStr, yearStr] = expiry.split('/');
      const brand = getEffectiveBrand();
      const last4 = getEffectiveLast4();
      const payload = {
        last4,
        brand,
        expiryMonth: parseInt(monthStr, 10),
        expiryYear: 2000 + parseInt(yearStr, 10),
        isDefault,
      };

      try {
        const response = await api.patch<{ success: boolean; data?: any; error?: string }>(
          `/payments/methods/${id}`,
          payload
        );
        if (!response.success) {
          throw new Error(response.error || 'Failed to update card');
        }
      } catch (patchError: any) {
        const status = patchError?.response?.status;
        // Older API builds may not support PATCH — recreate the card instead
        if (status === 404 || status === 405) {
          await api.delete(`/payments/methods/${id}`);
          const created = await api.post<{ success: boolean; error?: string }>(
            '/payments/methods',
            payload
          );
          if (!created.success) {
            throw new Error(created.error || 'Failed to update card');
          }
        } else {
          throw patchError;
        }
      }

      router.back();
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to update card. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await api.delete(`/payments/methods/${id}`);
      setShowDeleteModal(false);
      router.back();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.error || error?.message || 'Failed to remove card'
      );
    }
  };

  const getBorderColor = (field: string) => {
    if (errors[field]) return '#EF4444';
    if (focusedField === field) return '#2E7AD9';
    return 'rgba(46, 122, 217, 0.15)';
  };

  const getBorderWidth = (field: string) => {
    if (errors[field] || focusedField === field) return 2;
    return 1;
  };

  const previewBrand = getEffectiveBrand();
  const previewLast4 = getEffectiveLast4();
  const previewNumber = cardNumber.includes('•')
    ? cardNumber
    : cardNumber || `•••• •••• •••• ${originalLast4}`;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Payment Method</Text>
            <View style={{ width: 40 }} />
          </View>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2E7AD9" />
        </View>
      </SafeAreaView>
    );
  }

  if (notFound) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Payment Method</Text>
            <View style={{ width: 40 }} />
          </View>
        </View>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Card not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7FF" />

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Payment Method</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient colors={['#2E7AD9', '#1E6BC9']} style={styles.cardPreview}>
          <View style={styles.cardPreviewTop}>
            <Ionicons name="card" size={40} color="#FFFFFF" />
            <Text style={styles.cardTypeLabel}>{getCardName(previewBrand)}</Text>
          </View>
          <Text style={styles.cardPreviewNumber}>{previewNumber}</Text>
          <View style={styles.cardPreviewBottom}>
            <View>
              <Text style={styles.cardPreviewLabel}>Last 4</Text>
              <Text style={styles.cardPreviewValue}>{previewLast4 || '----'}</Text>
            </View>
            <View>
              <Text style={styles.cardPreviewLabel}>Expires</Text>
              <Text style={styles.cardPreviewValue}>{expiry || 'MM/YY'}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Number</Text>
          <View
            style={[
              styles.inputContainer,
              { borderColor: getBorderColor('cardNumber'), borderWidth: getBorderWidth('cardNumber') },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#94A3B8"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              onFocus={() => {
                setFocusedField('cardNumber');
                if (cardNumber.includes('•')) setCardNumber('');
              }}
              onBlur={() => {
                setFocusedField(null);
                if (!cardNumber.replace(/\D/g, '')) {
                  setCardNumber(`•••• •••• •••• ${originalLast4}`);
                }
              }}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>
          {errors.cardNumber ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={14} color="#EF4444" />
              <Text style={styles.errorText}>{errors.cardNumber}</Text>
            </View>
          ) : (
            <Text style={styles.hintText}>Tap to enter a new card number, or leave as-is</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expiry Date *</Text>
          <View
            style={[
              styles.inputContainer,
              { borderColor: getBorderColor('expiry'), borderWidth: getBorderWidth('expiry') },
            ]}
          >
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

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Default Payment Method</Text>
            <Text style={styles.toggleDescription}>Use this card for all payments</Text>
          </View>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
            thumbColor={isDefault ? '#2E7AD9' : '#F8FAFC'}
          />
        </View>

        <TouchableOpacity onPress={handleSave} disabled={isSaving} activeOpacity={0.85}>
          <LinearGradient
            colors={['#2E7AD9', '#1E6BC9']}
            style={[styles.saveBtn, isSaving && { opacity: 0.6 }]}
          >
            <Text style={styles.saveBtnText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
          <Text style={styles.deleteText}>Remove Card</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Card"
        message="Are you sure you want to remove this payment method?"
        type="danger"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleDelete}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 15,
    color: '#64748B',
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
  hintText: {
    marginTop: 6,
    fontSize: 12,
    color: '#94A3B8',
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.15)',
    padding: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    color: '#64748B',
  },
  saveBtn: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginTop: 8,
  },
  deleteText: {
    fontSize: 15,
    color: '#EF4444',
    fontWeight: '500',
  },
});
