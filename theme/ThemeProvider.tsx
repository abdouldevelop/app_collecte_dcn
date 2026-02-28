import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { lightColors, darkColors, type AppColors } from './colors';
import { spacing, radius, elevation, typography, touchTarget, iconSize, avatarSize } from './tokens';
import { springs, durations, easings, stagger, scalePresets, shimmer } from './animations';

// ============================================================
// THEME PROVIDER - APP COLLECTE
// Fournit le theme complet a toute l'application
// ============================================================

export interface AppTheme {
  dark: boolean;
  colors: AppColors;
  spacing: typeof spacing;
  radius: typeof radius;
  elevation: typeof elevation;
  typography: typeof typography;
  touchTarget: typeof touchTarget;
  iconSize: typeof iconSize;
  avatarSize: typeof avatarSize;
  animations: {
    springs: typeof springs;
    durations: typeof durations;
    easings: typeof easings;
    stagger: typeof stagger;
    scalePresets: typeof scalePresets;
    shimmer: typeof shimmer;
  };
}

const ThemeContext = createContext<AppTheme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = useMemo<AppTheme>(
    () => ({
      dark: isDark,
      colors: isDark ? darkColors : lightColors,
      spacing,
      radius,
      elevation,
      typography,
      touchTarget,
      iconSize,
      avatarSize,
      animations: {
        springs,
        durations,
        easings,
        stagger,
        scalePresets,
        shimmer,
      },
    }),
    [isDark],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

// Fallback theme for when ThemeProvider hasn't mounted yet
const fallbackTheme: AppTheme = {
  dark: false,
  colors: lightColors,
  spacing,
  radius,
  elevation,
  typography,
  touchTarget,
  iconSize,
  avatarSize,
  animations: {
    springs,
    durations,
    easings,
    stagger,
    scalePresets,
    shimmer,
  },
};

/**
 * Hook pour acceder au theme dans n'importe quel composant.
 *
 * @example
 * const { colors, spacing, typography } = useAppTheme();
 */
export function useAppTheme(): AppTheme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    // Return fallback instead of throwing to prevent cascade crashes
    return fallbackTheme;
  }
  return theme;
}

/**
 * Utility pour creer des styles thematiques avec memoisation.
 *
 * @example
 * const useStyles = createStyles((theme) => ({
 *   container: { backgroundColor: theme.colors.background, padding: theme.spacing.lg },
 *   title: { ...theme.typography.headlineMedium, color: theme.colors.onSurface },
 * }));
 *
 * // Dans le composant :
 * const styles = useStyles();
 */
export function createStyles<T extends StyleSheet.NamedStyles<T>>(
  styleFactory: (theme: AppTheme) => T,
) {
  return function useStyles(): T {
    const theme = useAppTheme();
    return useMemo(() => StyleSheet.create(styleFactory(theme)), [theme]);
  };
}
