import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight, borderWidth } from '../../constants/theme';
import { IconButton } from '../ui/IconButton';

type AddressType = 'home' | 'work' | 'doctor' | 'pharmacy' | 'other';

interface AddressCardProps {
  id: string;
  type: AddressType;
  label: string;
  address: string;
  isDefault?: boolean;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  selectable?: boolean;
  selected?: boolean;
}

/**
 * Address Card matching wireframes
 * - Type icon
 * - Label and address
 * - Default badge
 * - Edit/Delete actions
 */
export function AddressCard({
  id,
  type,
  label,
  address,
  isDefault = false,
  onPress,
  onEdit,
  onDelete,
  onSetDefault,
  selectable = false,
  selected = false,
}: AddressCardProps) {
  const getTypeIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'home':
        return 'home-outline';
      case 'work':
        return 'briefcase-outline';
      case 'doctor':
        return 'medkit-outline';
      case 'pharmacy':
        return 'medical-outline';
      default:
        return 'location-outline';
    }
  };

  const Container = onPress || selectable ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        selected && styles.containerSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name={getTypeIcon()} size={24} color={colors.text.secondary} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.address} numberOfLines={2}>
          {address}
        </Text>
        {!isDefault && onSetDefault && (
          <TouchableOpacity onPress={onSetDefault} style={styles.setDefaultButton}>
            <Text style={styles.setDefaultText}>Set as default</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Actions or Selection */}
      {selectable ? (
        <View style={styles.selectionIndicator}>
          {selected ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          ) : (
            <View style={styles.unselectedCircle} />
          )}
        </View>
      ) : (
        <View style={styles.actions}>
          {onEdit && (
            <IconButton
              icon="create-outline"
              onPress={onEdit}
              size="sm"
              variant="ghost"
            />
          )}
          {onDelete && !isDefault && (
            <IconButton
              icon="trash-outline"
              onPress={onDelete}
              size="sm"
              variant="ghost"
              color={colors.status.error}
            />
          )}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderWidth: borderWidth.default,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  containerSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  defaultBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.background,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  setDefaultButton: {
    marginTop: spacing.sm,
  },
  setDefaultText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  selectionIndicator: {
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
  },
});

