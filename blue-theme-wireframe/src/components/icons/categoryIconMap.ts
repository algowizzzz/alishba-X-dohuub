import {
  SprayBottle,
  Wrench,
  ForkKnife,
  ShoppingCart,
  Scissors,
  FlowerLotus,
  House,
  HeartHalf,
  Car,
  UsersThree,
  HandHeart,
  Sparkle,
  SquaresFour,
  CalendarCheck,
  ChatCircleDots,
} from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';

export interface CategoryIconConfig {
  icon: Icon;
  gradient: [string, string];
  label: string;
}

// Primary category icons — used on Home, vendor lists, detail screens, booking/confirmation
export const categoryIcons: Record<string, CategoryIconConfig> = {
  cleaning: {
    icon: SprayBottle,
    gradient: ['#4CA6FA', '#1D4AAD'],
    label: 'Cleaning',
  },
  handyman: {
    icon: Wrench,
    gradient: ['#F59E0B', '#B45309'],
    label: 'Handyman',
  },
  food: {
    icon: ForkKnife,
    gradient: ['#FB923C', '#EA580C'],
    label: 'Food',
  },
  groceries: {
    icon: ShoppingCart,
    gradient: ['#F59E0B', '#16A34A'],
    label: 'Groceries',
  },
  beauty: {
    icon: Scissors,
    gradient: ['#F472B6', '#DB2777'],
    label: 'Beauty Services',
  },
  beautyProducts: {
    icon: FlowerLotus,
    gradient: ['#E879F9', '#A855F7'],
    label: 'Beauty Products',
  },
  rentals: {
    icon: House,
    gradient: ['#34D399', '#059669'],
    label: 'Rentals',
  },
  caregiving: {
    icon: HeartHalf,
    gradient: ['#A78BFA', '#7C3AED'],
    label: 'Caregiving',
  },
  rides: {
    icon: Car,
    gradient: ['#818CF8', '#6366F1'],
    label: 'Rides',
  },
  companionship: {
    icon: UsersThree,
    gradient: ['#C4B5FD', '#8B5CF6'],
    label: 'Companionship',
  },
};

// Onboarding slide icons — used on OnboardingCarousel
export const onboardingIcons = {
  welcome: { icon: Sparkle, gradient: ['#4CA6FA', '#1D4AAD'] as [string, string] },
  allServices: { icon: SquaresFour, gradient: ['#FB923C', '#EA580C'] as [string, string] },
  easyBooking: { icon: CalendarCheck, gradient: ['#34D399', '#059669'] as [string, string] },
  aiAssistant: { icon: ChatCircleDots, gradient: ['#A78BFA', '#7C3AED'] as [string, string] },
};

// Caregiving sub-category icons — used on CaregivingChoiceScreen
export const caregivingSubIcons = {
  rides: { icon: Car, gradient: ['#818CF8', '#6366F1'] as [string, string] },
  companionship: { icon: HandHeart, gradient: ['#C4B5FD', '#8B5CF6'] as [string, string] },
};

// Beauty sub-category icons — used on BeautyChoiceScreen
export const beautySubIcons = {
  services: { icon: Scissors, gradient: ['#F472B6', '#DB2777'] as [string, string] },
  products: { icon: FlowerLotus, gradient: ['#E879F9', '#A855F7'] as [string, string] },
};

// Food/Grocery sub-category icons — used on FoodGrocerySelectionScreen
export const foodGrocerySubIcons = {
  food: { icon: ForkKnife, gradient: ['#FB923C', '#EA580C'] as [string, string] },
  grocery: { icon: ShoppingCart, gradient: ['#F59E0B', '#16A34A'] as [string, string] },
};
