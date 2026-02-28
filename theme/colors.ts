// ============================================================
// COLOR SYSTEM - APP COLLECTE
// Inspire de Material Design 3 Color Roles
// Palette: Indigo / Violet / Rose
// ============================================================

export interface AppColors {
  // --- Primary ---
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;

  // --- Secondary ---
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;

  // --- Tertiary ---
  tertiary: string;
  tertiaryContainer: string;
  onTertiary: string;
  onTertiaryContainer: string;

  // --- Error ---
  error: string;
  errorContainer: string;
  onError: string;
  onErrorContainer: string;

  // --- Success ---
  success: string;
  successContainer: string;
  onSuccess: string;
  onSuccessContainer: string;

  // --- Warning ---
  warning: string;
  warningContainer: string;
  onWarning: string;
  onWarningContainer: string;

  // --- Surfaces ---
  background: string;
  surface: string;
  surfaceVariant: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;

  // --- On Surfaces ---
  onBackground: string;
  onSurface: string;
  onSurfaceVariant: string;

  // --- Outline ---
  outline: string;
  outlineVariant: string;

  // --- Other ---
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  shadow: string;

  // --- Gradient ---
  gradient: {
    primary: string[];
    secondary: string[];
    warm: string[];
  };

  // --- Dashboard accents ---
  accent: {
    blue: string;
    blueBg: string;
    red: string;
    redBg: string;
    orange: string;
    orangeBg: string;
    green: string;
    greenBg: string;
  };
}

export const lightColors: AppColors = {
  // --- Primary (Indigo) ---
  primary: '#6366F1',
  primaryContainer: '#E0E7FF',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#312E81',

  // --- Secondary (Violet) ---
  secondary: '#8B5CF6',
  secondaryContainer: '#EDE9FE',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#4C1D95',

  // --- Tertiary (Rose) ---
  tertiary: '#EC4899',
  tertiaryContainer: '#FCE7F3',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#831843',

  // --- Error ---
  error: '#DC2626',
  errorContainer: '#FEE2E2',
  onError: '#FFFFFF',
  onErrorContainer: '#991B1B',

  // --- Success ---
  success: '#059669',
  successContainer: '#D1FAE5',
  onSuccess: '#FFFFFF',
  onSuccessContainer: '#065F46',

  // --- Warning ---
  warning: '#D97706',
  warningContainer: '#FEF3C7',
  onWarning: '#FFFFFF',
  onWarningContainer: '#92400E',

  // --- Surfaces ---
  background: '#F8F9FC',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F0F7',
  surfaceDim: '#DDD8E4',
  surfaceBright: '#FFFFFF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F7F2FA',
  surfaceContainer: '#F1ECF4',
  surfaceContainerHigh: '#EBE6EE',
  surfaceContainerHighest: '#E5E1E9',

  // --- On Surfaces ---
  onBackground: '#1C1B1F',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',

  // --- Outline ---
  outline: '#79747E',
  outlineVariant: '#E7E0EC',

  // --- Other ---
  scrim: 'rgba(0, 0, 0, 0.32)',
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#C7D2FE',
  shadow: '#000000',

  // --- Gradients ---
  gradient: {
    primary: ['#6366F1', '#8B5CF6'],
    secondary: ['#8B5CF6', '#EC4899'],
    warm: ['#6366F1', '#8B5CF6', '#EC4899'],
  },

  // --- Dashboard accents ---
  accent: {
    blue: '#3B82F6',
    blueBg: '#DBEAFE',
    red: '#EF4444',
    redBg: '#FEE2E2',
    orange: '#F97316',
    orangeBg: '#FFEDD5',
    green: '#10B981',
    greenBg: '#D1FAE5',
  },
};

export const darkColors: AppColors = {
  // --- Primary (Indigo) ---
  primary: '#A5B4FC',
  primaryContainer: '#4338CA',
  onPrimary: '#1E1B4B',
  onPrimaryContainer: '#E0E7FF',

  // --- Secondary (Violet) ---
  secondary: '#C4B5FD',
  secondaryContainer: '#6D28D9',
  onSecondary: '#2E1065',
  onSecondaryContainer: '#EDE9FE',

  // --- Tertiary (Rose) ---
  tertiary: '#F9A8D4',
  tertiaryContainer: '#9D174D',
  onTertiary: '#500724',
  onTertiaryContainer: '#FCE7F3',

  // --- Error ---
  error: '#FCA5A5',
  errorContainer: '#991B1B',
  onError: '#450A0A',
  onErrorContainer: '#FEE2E2',

  // --- Success ---
  success: '#6EE7B7',
  successContainer: '#065F46',
  onSuccess: '#022C22',
  onSuccessContainer: '#D1FAE5',

  // --- Warning ---
  warning: '#FCD34D',
  warningContainer: '#92400E',
  onWarning: '#451A03',
  onWarningContainer: '#FEF3C7',

  // --- Surfaces ---
  background: '#121218',
  surface: '#1C1B22',
  surfaceVariant: '#2D2D33',
  surfaceDim: '#141218',
  surfaceBright: '#3B383E',
  surfaceContainerLowest: '#0F0D13',
  surfaceContainerLow: '#1D1B20',
  surfaceContainer: '#211F26',
  surfaceContainerHigh: '#2B2930',
  surfaceContainerHighest: '#36343B',

  // --- On Surfaces ---
  onBackground: '#E6E1E5',
  onSurface: '#E6E1E5',
  onSurfaceVariant: '#CAC4D0',

  // --- Outline ---
  outline: '#938F99',
  outlineVariant: '#49454F',

  // --- Other ---
  scrim: 'rgba(0, 0, 0, 0.64)',
  inverseSurface: '#E6E1E5',
  inverseOnSurface: '#313033',
  inversePrimary: '#6366F1',
  shadow: '#000000',

  // --- Gradients ---
  gradient: {
    primary: ['#4338CA', '#6D28D9'],
    secondary: ['#6D28D9', '#9D174D'],
    warm: ['#4338CA', '#6D28D9', '#9D174D'],
  },

  // --- Dashboard accents ---
  accent: {
    blue: '#60A5FA',
    blueBg: '#1E3A5F',
    red: '#F87171',
    redBg: '#5F1E1E',
    orange: '#FB923C',
    orangeBg: '#5F3A1E',
    green: '#34D399',
    greenBg: '#1E5F3A',
  },
};
