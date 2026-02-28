import { Platform } from 'react-native';
import { s } from 'react-native-size-matters';

// ============================================================
// DESIGN TOKENS - APP COLLECTE
// Standards: Material Design 3 + Apple HIG
// Grille: 4pt base
// ============================================================

// --- SPACING (grille 4pt) ---
export const spacing = {
  xxs: s(2),
  xs: s(4),
  sm: s(8),
  md: s(12),
  lg: s(16),
  xl: s(24),
  xxl: s(32),
  xxxl: s(48),
  xxxxl: s(64),
} as const;

// --- BORDER RADIUS (Material Design 3 shape system) ---
export const radius = {
  none: 0,
  xs: s(4),
  sm: s(8),
  md: s(12),
  lg: s(16),
  xl: s(24),
  xxl: s(28),
  full: 9999,
} as const;

// --- ELEVATION (shadows multi-plateformes) ---
export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// --- TYPOGRAPHY (echelle harmonique MD3) ---
export const typography = {
  displayLarge: {
    fontSize: s(32),
    lineHeight: s(40),
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: s(28),
    lineHeight: s(36),
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  headlineLarge: {
    fontSize: s(24),
    lineHeight: s(32),
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: s(20),
    lineHeight: s(28),
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  titleLarge: {
    fontSize: s(18),
    lineHeight: s(26),
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  titleMedium: {
    fontSize: s(16),
    lineHeight: s(24),
    fontWeight: '600' as const,
    letterSpacing: 0.15,
  },
  bodyLarge: {
    fontSize: s(16),
    lineHeight: s(24),
    fontWeight: '400' as const,
    letterSpacing: 0.25,
  },
  bodyMedium: {
    fontSize: s(14),
    lineHeight: s(20),
    fontWeight: '400' as const,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: s(12),
    lineHeight: s(16),
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontSize: s(14),
    lineHeight: s(20),
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: s(12),
    lineHeight: s(16),
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: s(11),
    lineHeight: s(16),
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
  caption: {
    fontSize: s(10),
    lineHeight: s(14),
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },
} as const;

// --- TOUCH TARGETS (Apple HIG: 44pt min, MD3: 48dp) ---
export const touchTarget = {
  min: Platform.OS === 'ios' ? 44 : 48,
  comfortable: 56,
} as const;

// --- ICON SIZES ---
export const iconSize = {
  xs: s(16),
  sm: s(20),
  md: s(24),
  lg: s(28),
  xl: s(32),
} as const;

// --- AVATAR SIZES ---
export const avatarSize = {
  sm: s(32),
  md: s(40),
  lg: s(56),
  xl: s(72),
} as const;
