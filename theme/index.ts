// ============================================================
// THEME - APP COLLECTE
// Point d'entree unique pour tout le design system
// ============================================================

// Provider & Hook
export { ThemeProvider, useAppTheme, createStyles } from './ThemeProvider';
export type { AppTheme } from './ThemeProvider';

// Tokens
export { spacing, radius, elevation, typography, touchTarget, iconSize, avatarSize } from './tokens';

// Colors
export { lightColors, darkColors } from './colors';
export type { AppColors } from './colors';

// Animations
export { springs, durations, easings, stagger, scalePresets, shimmer } from './animations';
