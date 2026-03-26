import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight, borderWidth } from '../../constants/theme';

interface CartItemProps {
  id: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  image?: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

/**
 * Cart Item Component matching wireframes
 * - Product image
 * - Name and variant
 * - Price
 * - Quantity stepper (+/-)
 * - Remove button
 * - Subtotal
 */
export function CartItem({
  id,
  name,
  variant,
  price,
  quantity,
  image,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  const subtotal = price * quantity;

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="cube-outline" size={24} color={colors.text.muted} />
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        {variant && <Text style={styles.variant}>{variant}</Text>}
        <Text style={styles.price}>${price.toFixed(2)}</Text>
      </View>

      {/* Right Side: Quantity & Subtotal */}
      <View style={styles.rightSide}>
        {/* Quantity Stepper */}
        <View style={styles.quantityStepper}>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={onDecrement}
            disabled={quantity <= 1}
          >
            <Ionicons
              name="remove"
              size={16}
              color={quantity <= 1 ? colors.border.default : colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity style={styles.stepperButton} onPress={onIncrement}>
            <Ionicons name="add" size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Subtotal */}
        <Text style={styles.subtotal}>${subtotal.toFixed(2)}</Text>

        {/* Remove Button */}
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Ionicons name="trash-outline" size={16} color={colors.status.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  imageContainer: {
    marginRight: spacing.md,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  variant: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  rightSide: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.md,
  },
  stepperButton: {
    padding: spacing.sm,
  },
  quantity: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  removeButton: {
    padding: spacing.xs,
    marginTop: spacing.xs,
  },
});

