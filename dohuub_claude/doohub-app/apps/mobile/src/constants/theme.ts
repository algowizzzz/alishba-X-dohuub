// DoHuub Blue Theme - extracted from official colored wireframe
export const colors = {
  // Gray scale (for text, borders, neutral backgrounds)
  gray: {
    900: '#1E293B',  // --foreground
    800: '#1E293B',  // kept for backward compat
    700: '#374151',
    600: '#64748B',  // --muted-foreground
    500: '#6b7280',
    400: '#9ca3af',
    300: '#CBD5E1',  // --switch-background
    200: '#e5e7eb',
    100: '#E8F1FC',  // --muted
    50: '#F0F7FF',   // --background
  },

  // Blue brand colors
  blue: {
    900: '#1E40AF',  // --accent-foreground
    800: '#1D4AAD',  // --primary-dark / --primary-gradient-end
    700: '#2563EB',
    600: '#2E7AD9',  // --primary
    500: '#4CA6FA',  // --primary-light / --primary-gradient-start
    400: '#60a5fa',
    300: '#93c5fd',
    200: '#DBEAFE',  // --accent
    100: '#E0EDFF',  // --secondary
    50: '#F0F7FF',   // --background
  },

  primary: '#2E7AD9',        // --primary
  primaryDark: '#1D4AAD',    // --primary-dark (hover/press)
  primaryLight: '#4CA6FA',   // --primary-light
  primaryGradientStart: '#4CA6FA',
  primaryGradientEnd: '#1D4AAD',
  secondary: '#E0EDFF',      // --secondary
  secondaryForeground: '#1D4AAD', // --secondary-foreground
  background: '#F0F7FF',     // --background (light blue tint)
  backgroundSecondary: '#E3F0FF', // --background-secondary
  surface: '#ffffff',         // --card
  muted: '#E8F1FC',          // --muted

  text: {
    primary: '#1E293B',      // --foreground
    secondary: '#64748B',    // --muted-foreground
    muted: '#9ca3af',
    inverse: '#ffffff',      // --primary-foreground
    accent: '#1D4AAD',       // --secondary-foreground
  },

  border: {
    light: '#E0EDFF',        // blue-100
    default: '#CBD5E1',      // --switch-background (neutral)
    dark: '#9ca3af',
    accent: '#4CA6FA',       // --ring / --primary-light
  },

  status: {
    success: '#10B981',      // --success
    successLight: '#D1FAE5', // --success-light
    warning: '#F59E0B',      // --warning
    warningLight: '#FEF3C7', // --warning-light
    error: '#EF4444',        // --destructive
    errorLight: '#FEE2E2',   // --destructive-light
    info: '#3B82F6',         // --info
    infoLight: '#DBEAFE',    // --info-light
  },

  rating: '#fbbf24',

  // Category colors (from wireframe)
  category: {
    cleaning: '#2E7AD9',     // blue (primary)
    cleaningLight: '#DBEAFE',
    handyman: '#EAB308',     // yellow
    handymanLight: '#FEF9C3',
    groceries: '#F59E0B',    // amber (food)
    groceriesLight: '#FEF3C7',
    beauty: '#EC4899',       // pink
    beautyLight: '#FCE7F3',
    rentals: '#10B981',      // emerald
    rentalsLight: '#D1FAE5',
    caregiving: '#8B5CF6',   // violet
    caregivingLight: '#EDE9FE',
  },
};

// Standard border width
export const borderWidth = {
  default: 2,
  thin: 1,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
