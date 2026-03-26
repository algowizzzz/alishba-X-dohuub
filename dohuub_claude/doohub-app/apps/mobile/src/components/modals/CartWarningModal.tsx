import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../constants/theme';

interface CartWarningModalProps {
  visible: boolean;
  onClose: () => void;
  onClearCart: () => void;
  onKeepCart: () => void;
  currentVendorName?: string;
  newVendorName?: string;
}

/**
 * Cart Warning Modal matching wireframes
 * - Warning about different vendor
 * - Clear cart and add / Keep current cart options
 */
export function CartWarningModal({
  visible,
  onClose,
  onClearCart,
  onKeepCart,
  currentVendorName = 'current vendor',
  newVendorName = 'new vendor',
}: CartWarningModalProps) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      size="sm"
    >
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="cart-outline" size={32} color={colors.status.warning} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Different Vendor</Text>

        {/* Message */}
        <Text style={styles.message}>
          Your cart contains items from {currentVendorName}. Would you like to clear your cart and add items from {newVendorName} instead?
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Keep Current Cart"
            variant="outline"
            onPress={onKeepCart}
            style={styles.keepButton}
          />
          <Button
            title="Clear Cart & Add"
            onPress={onClearCart}
            style={styles.clearButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  keepButton: {
    width: '100%',
  },
  clearButton: {
    width: '100%',
  },
});

