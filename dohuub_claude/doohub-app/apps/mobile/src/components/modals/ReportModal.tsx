import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { colors, spacing, borderRadius, fontSize, fontWeight, borderWidth } from '../../constants/theme';

const REPORT_REASONS = [
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'misleading', label: 'Misleading information' },
  { id: 'spam', label: 'Spam or scam' },
  { id: 'other', label: 'Other' },
];

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string, comment: string) => void;
  loading?: boolean;
  listingName?: string;
}

/**
 * Report Listing Modal matching wireframes
 * - Title: "Report Listing"
 * - Reason selection (radio buttons)
 * - Comment text input
 * - Cancel/Submit buttons
 */
export function ReportModal({
  visible,
  onClose,
  onSubmit,
  loading = false,
  listingName,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason, comment);
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    setComment('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="Report Listing"
      size="md"
    >
      <View style={styles.content}>
        {listingName && (
          <Text style={styles.subtitle}>
            Report: {listingName}
          </Text>
        )}

        {/* Reason Selection */}
        <Text style={styles.label}>Why are you reporting this listing?</Text>
        <View style={styles.reasons}>
          {REPORT_REASONS.map((reason) => (
            <TouchableOpacity
              key={reason.id}
              style={styles.reasonItem}
              onPress={() => setSelectedReason(reason.id)}
            >
              <View style={styles.radioOuter}>
                {selectedReason === reason.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.reasonLabel}>{reason.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment Input */}
        <Text style={styles.label}>Additional details (optional)</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Please provide more details..."
          placeholderTextColor={colors.text.muted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={comment}
          onChangeText={setComment}
        />

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={handleClose}
            style={styles.cancelButton}
          />
          <Button
            title="Submit Report"
            onPress={handleSubmit}
            loading={loading}
            disabled={!selectedReason}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  reasons: {
    marginBottom: spacing.lg,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.text.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  reasonLabel: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  commentInput: {
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    minHeight: 100,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});

