import React, { useCallback, useRef, useState } from 'react';
import { TextInput, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { s } from 'react-native-size-matters';
import { useAppTheme } from '@/theme';

// ============================================================
// AppSearchBar - Barre de recherche animee
// Icone, champ texte, bouton clear, animations focus
// ============================================================

const AnimatedFeather = Animated.createAnimatedComponent(Feather);

export interface AppSearchBarProps {
  /** Current search value */
  value: string;
  /** Text change handler */
  onChangeText: (text: string) => void;
  /** Placeholder text (default "Rechercher...") */
  placeholder?: string;
  /** Focus handler */
  onFocus?: () => void;
  /** Blur handler */
  onBlur?: () => void;
}

const SEARCH_BAR_HEIGHT = s(48);

export function AppSearchBar({
  value,
  onChangeText,
  placeholder = 'Rechercher...',
  onFocus: onFocusProp,
  onBlur: onBlurProp,
}: AppSearchBarProps) {
  const { colors, spacing, radius, typography, animations } = useAppTheme();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  // ── Animation shared values ────────────────────────────────
  const focusProgress = useSharedValue(0);
  const iconScale = useSharedValue(1);

  // ── Focus / Blur handlers ──────────────────────────────────
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    focusProgress.value = withTiming(1, { duration: animations.durations.normal });
    iconScale.value = withSpring(1.15, animations.springs.bouncy);
    onFocusProp?.();
  }, [focusProgress, iconScale, animations, onFocusProp]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    focusProgress.value = withTiming(0, { duration: animations.durations.normal });
    iconScale.value = withSpring(1, animations.springs.bouncy);
    onBlurProp?.();
  }, [focusProgress, iconScale, animations, onBlurProp]);

  // ── Clear button ───────────────────────────────────────────
  const handleClear = useCallback(() => {
    onChangeText('');
    inputRef.current?.focus();
  }, [onChangeText]);

  // ── Animated container border ──────────────────────────────
  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      ['transparent', colors.primary],
    );

    return {
      borderColor,
      borderWidth: 2,
    };
  }, [colors.primary]);

  // ── Animated search icon scale ─────────────────────────────
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: SEARCH_BAR_HEIGHT,
          borderRadius: radius.xl,
          backgroundColor: colors.surfaceContainerHigh,
          paddingHorizontal: spacing.lg,
        },
        animatedContainerStyle,
      ]}
    >
      {/* Search Icon */}
      <AnimatedFeather
        name="search"
        size={s(20)}
        color={colors.onSurfaceVariant}
        style={[styles.searchIcon, animatedIconStyle]}
      />

      {/* Text Input */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceVariant}
        style={[
          styles.input,
          typography.bodyMedium,
          { color: colors.onSurface },
        ]}
        selectionColor={colors.primary}
        cursorColor={colors.primary}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />

      {/* Clear Button */}
      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Effacer la recherche"
        >
          <Feather
            name="x"
            size={s(18)}
            color={colors.onSurfaceVariant}
          />
        </Pressable>
      )}
    </Animated.View>
  );
}

// ============================================================
// STATIC STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default AppSearchBar;
