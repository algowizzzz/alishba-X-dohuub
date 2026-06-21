import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { colors, spacing, borderRadius, fontSize, fontWeight, borderWidth } from '../../constants/theme';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  /** Called when the user typed DELETE and tapped the destructive button. */
  onConfirm: () => void;
  loading?: boolean;
}

const CONFIRM_WORD = 'DELETE';

/**
 * Delete-account confirmation modal. We use typed confirmation rather than a
 * password because this app authenticates via email + OTP and stores no
 * password hash for most users — a password input would be theatre.
 */
export function DeleteAccountModal({
  visible,
  onClose,
  onConfirm,
  loading = false,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const matches = confirmText.trim().toUpperCase() === CONFIRM_WORD;

  const handleConfirm = () => {
    if (matches) onConfirm();
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      showCloseButton={false}
      size="md"
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={32} color={colors.status.error} />
        </View>

        <Text style={styles.title}>Delete Account</Text>

        <Text style={styles.description}>
          This is permanent. We will erase your name, contact info, addresses, payment methods,
          and notification tokens. Your past bookings and orders will remain on file in an
          anonymized form for our records.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Type <Text style={styles.inputLabelEmphasis}>{CONFIRM_WORD}</Text> to confirm
          </Text>
          <View style={styles.confirmInput}>
            <TextInput
              style={styles.input}
              placeholder={CONFIRM_WORD}
              placeholderTextColor={colors.text.muted}
              value={confirmText}
              onChangeText={setConfirmText}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={handleClose}
            style={styles.cancelButton}
          />
          <Button
            title="Delete Account"
            onPress={handleConfirm}
            loading={loading}
            disabled={!matches}
            style={styles.deleteButton}
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
    backgroundColor: '#FEE2E2',
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
  description: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  inputLabelEmphasis: {
    fontWeight: fontWeight.semibold,
    color: colors.status.error,
  },
  confirmInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.status.error,
    borderColor: colors.status.error,
  },
});
