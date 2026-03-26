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

type ConfirmType = 'danger' | 'warning' | 'info';

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: ConfirmType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

/**
 * Confirm Modal matching wireframes
 * - Used for destructive actions (delete, logout, cancel)
 * - Icon indicator for type
 * - Confirm/Cancel buttons
 */
export function ConfirmModal({
  visible,
  onClose,
  title,
  message,
  type = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'alert-circle' as const,
          color: colors.status.error,
          bgColor: '#FEE2E2',
        };
      case 'warning':
        return {
          icon: 'warning' as const,
          color: colors.status.warning,
          bgColor: '#FEF3C7',
        };
      case 'info':
        return {
          icon: 'information-circle' as const,
          color: colors.status.info,
          bgColor: '#DBEAFE',
        };
      default:
        return {
          icon: 'alert-circle' as const,
          color: colors.status.error,
          bgColor: '#FEE2E2',
        };
    }
  };

  const config = getTypeConfig();

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      size="sm"
    >
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
          <Ionicons name={config.icon} size={32} color={config.color} />
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Message */}
        <Text style={styles.message}>{message}</Text>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title={cancelText}
            variant="outline"
            onPress={handleCancel}
            style={styles.cancelButton}
          />
          <Button
            title={confirmText}
            onPress={onConfirm}
            loading={loading}
            style={[
              styles.confirmButton,
              type === 'danger' && styles.dangerButton,
            ]}
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
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  dangerButton: {
    backgroundColor: colors.status.error,
    borderColor: colors.status.error,
  },
});

