import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderWidth, fontSize } from '../../constants/theme';

interface ScreenHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  onRightAction?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
}

/**
 * Generic screen header matching wireframe:
 * - Back button on left
 * - Title in center
 * - Optional action on right
 */
export function ScreenHeader({
  title,
  showBack = true,
  onBack,
  rightAction,
  onRightAction,
  rightIcon,
}: ScreenHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/address-setup');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>

      {title && <Text style={styles.title}>{title}</Text>}

      <View style={styles.rightSection}>
        {rightAction}
        {rightIcon && onRightAction && (
          <TouchableOpacity style={styles.actionButton} onPress={onRightAction}>
            <Ionicons name={rightIcon} size={24} color={colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: borderWidth.default,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: '#FFFFFF',
    minHeight: 56,
  },
  leftSection: {
    width: 48,
    alignItems: 'flex-start',
  },
  rightSection: {
    width: 48,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: spacing.xs,
  },
  actionButton: {
    padding: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'left',
    marginLeft: spacing.sm,
  },
});

