import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button } from '../../src/components/ui';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/store/authStore';

/**
 * Detects card type from card number prefix.
 * 4 = VISA, 5 = MASTERCARD, 3 = AMEX, else VISA
 */
function detectCardType(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.startsWith('4')) return 'VISA';
  if (cleaned.startsWith('5')) return 'MASTERCARD';
  if (cleaned.startsWith('3')) return 'AMEX';
  return 'VISA';
}

/**
 * Add Payment Method Screen matching wireframe:
 * - Card number input
 * - Expiry date input
 * - CVC input
 * - Cardholder name
 * - Set as default toggle
 * - "Add Card" button
 */
export default function AddPaymentScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleAddCard = async () => {
    setIsAdding(true);
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Not authenticated');

      const cleanedNumber = cardNumber.replace(/\s/g, '');

      const { error } = await supabase.from('PaymentMethod').insert({
        id: `pm-${Date.now()}`,
        userId,
        type: detectCardType(cardNumber),
        last4: cleanedNumber.slice(-4),
        expiryMonth: parseInt(expiry.split('/')[0]),
        expiryYear: 2000 + parseInt(expiry.split('/')[1]),
        isDefault: setAsDefault,
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

  const isFormValid = cardNumber.length >= 18 && expiry.length === 5 && cvc.length >= 3 && cardholderName.trim() !== '';

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Add Payment Method" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Preview */}
        <View style={styles.cardPreview}>
          <View style={styles.cardPreviewTop}>
            <Ionicons name="card" size={32} color={colors.text.inverse} />
            <Text style={styles.cardPreviewType}>Credit Card</Text>
          </View>
          <Text style={styles.cardPreviewNumber}>
            {cardNumber || '•••• •••• •••• ••••'}
          </Text>
          <View style={styles.cardPreviewBottom}>
            <View>
              <Text style={styles.cardPreviewLabel}>CARDHOLDER</Text>
              <Text style={styles.cardPreviewValue}>
                {cardholderName.toUpperCase() || 'YOUR NAME'}
              </Text>
            </View>
            <View>
              <Text style={styles.cardPreviewLabel}>EXPIRES</Text>
              <Text style={styles.cardPreviewValue}>{expiry || 'MM/YY'}</Text>
            </View>
          </View>
        </View>

        {/* Card Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.text.muted}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>
        </View>

        {/* Expiry and CVC Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor={colors.text.muted}
                value={expiry}
                onChangeText={(text) => setExpiry(formatExpiry(text))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>CVC</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor={colors.text.muted}
                value={cvc}
                onChangeText={setCvc}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* Cardholder Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cardholder Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.input}
              placeholder="Name on card"
              placeholderTextColor={colors.text.muted}
              value={cardholderName}
              onChangeText={setCardholderName}
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* Set as Default */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Set as default</Text>
            <Text style={styles.toggleDescription}>
              Use this card for all payments
            </Text>
          </View>
          <Switch
            value={setAsDefault}
            onValueChange={setSetAsDefault}
            trackColor={{ false: colors.border.default, true: colors.text.secondary }}
            thumbColor={colors.background}
          />
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={16} color={colors.text.secondary} />
          <Text style={styles.securityText}>
            Your card information is securely encrypted
          </Text>
        </View>
      </ScrollView>

      {/* Add Button */}
      <View style={styles.footer}>
        <Button
          title="Add Card"
          onPress={handleAddCard}
          fullWidth
          loading={isAdding}
          disabled={!isFormValid}
        />
      </View>
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
    paddingBottom: 100,
  },
  cardPreview: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  cardPreviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardPreviewType: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  cardPreviewNumber: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.inverse,
    letterSpacing: 2,
    fontFamily: 'monospace',
    marginBottom: spacing.lg,
  },
  cardPreviewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPreviewLabel: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  cardPreviewValue: {
    fontSize: fontSize.sm,
    color: colors.text.inverse,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  toggleDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  securityText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
});

