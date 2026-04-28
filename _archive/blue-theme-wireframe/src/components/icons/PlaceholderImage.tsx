import React from 'react';
import {
  House,
  ForkKnife,
  ShoppingCart,
  FlowerLotus,
  Scissors,
  Car,
  UserCircle,
  Image,
  Camera,
  Star,
} from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';

type PlaceholderVariant =
  | 'property'
  | 'food'
  | 'grocery'
  | 'beauty-product'
  | 'beauty-service'
  | 'ride'
  | 'avatar'
  | 'review-photo'
  | 'generic';

interface PlaceholderImageProps {
  variant?: PlaceholderVariant;
  className?: string;
  style?: React.CSSProperties;
  iconSize?: number;
}

const variantConfig: Record<
  PlaceholderVariant,
  { icon: Icon; gradient: [string, string]; opacity: number }
> = {
  property: {
    icon: House,
    gradient: ['#34D399', '#059669'],
    opacity: 0.15,
  },
  food: {
    icon: ForkKnife,
    gradient: ['#FB923C', '#EA580C'],
    opacity: 0.15,
  },
  grocery: {
    icon: ShoppingCart,
    gradient: ['#F59E0B', '#16A34A'],
    opacity: 0.15,
  },
  'beauty-product': {
    icon: FlowerLotus,
    gradient: ['#E879F9', '#A855F7'],
    opacity: 0.15,
  },
  'beauty-service': {
    icon: Scissors,
    gradient: ['#F472B6', '#DB2777'],
    opacity: 0.15,
  },
  ride: {
    icon: Car,
    gradient: ['#818CF8', '#6366F1'],
    opacity: 0.15,
  },
  avatar: {
    icon: UserCircle,
    gradient: ['#A78BFA', '#7C3AED'],
    opacity: 0.2,
  },
  'review-photo': {
    icon: Camera,
    gradient: ['#4CA6FA', '#1D4AAD'],
    opacity: 0.12,
  },
  generic: {
    icon: Image,
    gradient: ['#4CA6FA', '#1D4AAD'],
    opacity: 0.12,
  },
};

export function PlaceholderImage({
  variant = 'generic',
  className = '',
  style = {},
  iconSize,
}: PlaceholderImageProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${config.gradient[0]}${Math.round(config.opacity * 255)
          .toString(16)
          .padStart(2, '0')}, ${config.gradient[1]}${Math.round(config.opacity * 255)
          .toString(16)
          .padStart(2, '0')})`,
        ...style,
      }}
    >
      <IconComponent
        size={iconSize || 32}
        weight="duotone"
        color={config.gradient[1]}
        style={{ opacity: 0.4 }}
      />
    </div>
  );
}

export type { PlaceholderVariant, PlaceholderImageProps };
