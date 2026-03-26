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

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

/**
 * Logout Modal matching wireframes
 * - Simple confirmation dialog
 * - Cancel/Logout buttons
 */
export function LogoutModal({
  visible,
  onClose,
  onConfirm,
  loading = false,
}: LogoutModalProps) {
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
          <Ionicons name="log-out-outline" size={32} color={colors.text.primary} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Log Out</Text>

        {/* Message */}
        <Text style={styles.message}>
          Are you sure you want to log out of your account?
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={styles.cancelButton}
          />
          <Button
            title="Log Out"
            onPress={onConfirm}
            loading={loading}
            style={styles.logoutButton}
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
    backgroundColor: colors.secondary,
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
  logoutButton: {
    flex: 1,
  },
});

