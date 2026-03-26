import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight, borderWidth } from '../../constants/theme';

interface AvatarProps {
  source?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  editable?: boolean;
  onEdit?: () => void;
  style?: any;
}

/**
 * Avatar component matching wireframes
 * - Circular image or initials fallback
 * - Edit icon overlay when editable
 * - 2px border
 */
export function Avatar({
  source,
  size = 'md',
  name,
  editable = false,
  onEdit,
  style,
}: AvatarProps) {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return 32;
      case 'md':
        return 48;
      case 'lg':
        return 72;
      case 'xl':
        return 120;
      default:
        return 48;
    }
  };

  const getInitials = () => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const sizeValue = getSize();
  const fontSizeValue = sizeValue * 0.4;

  const avatarContent = source ? (
    <Image
      source={{ uri: source }}
      style={[
        styles.image,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
        },
      ]}
    />
  ) : (
    <View
      style={[
        styles.placeholder,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: fontSizeValue }]}>
        {getInitials()}
      </Text>
    </View>
  );

  if (editable && onEdit) {
    return (
      <TouchableOpacity onPress={onEdit} style={[styles.container, style]}>
        {avatarContent}
        <View
          style={[
            styles.editBadge,
            {
              right: sizeValue * 0.05,
              bottom: sizeValue * 0.05,
            },
          ]}
        >
          <Ionicons name="camera" size={sizeValue * 0.2} color={colors.background} />
        </View>
      </TouchableOpacity>
    );
  }

  return <View style={[styles.container, style]}>{avatarContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    borderWidth: borderWidth.default,
    borderColor: 'rgba(46, 122, 217, 0.1)',
  },
  placeholder: {
    backgroundColor: colors.secondary,
    borderWidth: borderWidth.default,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
  },
  editBadge: {
    position: 'absolute',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    padding: spacing.xs,
    borderWidth: 2,
    borderColor: colors.background,
  },
});

