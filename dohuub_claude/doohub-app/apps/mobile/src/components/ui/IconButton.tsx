import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, borderWidth } from '../../constants/theme';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface IconButtonProps {
  icon: IoniconsName;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Icon Button component matching wireframes
 * - Circular or rounded square touch target
 * - Multiple variants: default, outline, ghost
 */
export function IconButton({
  icon,
  onPress,
  size = 'md',
  variant = 'default',
  color,
  disabled = false,
  style,
}: IconButtonProps) {
  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'md':
        return 20;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 32;
      case 'md':
        return 40;
      case 'lg':
        return 48;
      default:
        return 40;
    }
  };

  const getIconColor = () => {
    if (color) return color;
    if (disabled) return colors.text.muted;
    
    switch (variant) {
      case 'default':
        return colors.text.primary;
      case 'outline':
        return colors.text.primary;
      case 'ghost':
        return colors.text.secondary;
      default:
        return colors.text.primary;
    }
  };

  const buttonSize = getButtonSize();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        styles[variant],
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Ionicons
        name={icon}
        size={getIconSize()}
        color={getIconColor()}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  default: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: colors.background,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
});

