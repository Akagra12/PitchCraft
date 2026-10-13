/**
 * Design system — colors, spacing, typography, and shadows
 * used consistently across every screen.
 */

export const Colors = {
  // Dark theme (default)
  dark: {
    background: '#0F1629',       // Deep navy
    surface: '#1A2340',          // Card background
    surfaceElevated: '#222F4E',  // Elevated cards / modals
    border: '#2D3A5C',           // Subtle borders
    textPrimary: '#F0F2F8',      // Main text
    textSecondary: '#8E99B8',    // Muted text
    textTertiary: '#5A6688',     // Faint text
    accent: '#6C63FF',           // Electric violet
    accentLight: '#8B85FF',      // Lighter accent for hover
    accentDim: 'rgba(108,99,255,0.15)', // Accent background tint
    success: '#34D399',          // Green
    warning: '#FBBF24',          // Amber
    error: '#F87171',            // Red
    gold: '#FFD700',             // 1st place
    silver: '#C0C0C0',           // 2nd place
    bronze: '#CD7F32',           // 3rd place
    tabBarBg: '#131B30',         // Tab bar
    tabInactive: '#5A6688',      // Inactive tab icon
  },
  // Light theme
  light: {
    background: '#F5F7FC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: '#E2E6F0',
    textPrimary: '#1A1D2E',
    textSecondary: '#6B7394',
    textTertiary: '#9CA3BF',
    accent: '#6C63FF',
    accentLight: '#8B85FF',
    accentDim: 'rgba(108,99,255,0.08)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gold: '#D4A800',
    silver: '#8A8A8A',
    bronze: '#A86523',
    tabBarBg: '#FFFFFF',
    tabInactive: '#9CA3BF',
  },
};

export type ThemeColors = typeof Colors.dark;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  hero: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
