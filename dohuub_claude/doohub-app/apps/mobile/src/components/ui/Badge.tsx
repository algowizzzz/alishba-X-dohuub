import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'michelle';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ text, variant = 'primary', size = 'md', style }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant], styles[`size_${size}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`]]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  success: {
    backgroundColor: colors.status.success,
  },
  warning: {
    backgroundColor: colors.status.warning,
  },
  error: {
    backgroundColor: colors.status.error,
  },
  info: {
    backgroundColor: colors.status.info,
  },
  michelle: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.rating,
  },
  
  // Sizes
  size_sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  size_md: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    color: colors.text.inverse,
  },
  text_primary: { color: colors.text.inverse },
  text_success: { color: colors.text.inverse },
  text_warning: { color: colors.text.primary },
  text_error: { color: colors.text.inverse },
  text_info: { color: colors.text.inverse },
  text_michelle: { color: colors.rating },
  
  text_sm: { fontSize: fontSize.xs },
  text_md: { fontSize: fontSize.sm },
});

// Special badge for Michelle's listings
export function PoweredByDoHuubBadge() {
  return <Badge text="✨ Powered by DoHuub" variant="michelle" size="sm" />;
}

