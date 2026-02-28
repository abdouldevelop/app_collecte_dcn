import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { s } from 'react-native-size-matters';
import { useAppTheme, type AppTheme } from '@/theme';

// ============================================================
// ANIMATED PRESSABLE
// ============================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ============================================================
// TYPES
// ============================================================

type ButtonVariant = 'filled' | 'outlined' | 'text' | 'tonal';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  /** Button label text */
  label: string;
  /** Press handler */
  onPress?: (event: GestureResponderEvent) => void;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Feather icon name to display before the label */
  leftIcon?: keyof typeof Feather.glyphMap;
  /** Feather icon name to display after the label */
  rightIcon?: keyof typeof Feather.glyphMap;
  /** Show a loading indicator and disable press */
  loading?: boolean;
  /** Disable interaction */
  disabled?: boolean;
  /** Stretch to fill available width */
  fullWidth?: boolean;
  /** Use gradient background (only applies to filled variant) */
  gradient?: boolean;
  /** Additional container style overrides */
  style?: StyleProp<ViewStyle>;
  /** Additional label style overrides */
  labelStyle?: StyleProp<TextStyle>;
}

// ============================================================
// SIZE MAP
// ============================================================

const SIZE_CONFIG: Record<
  ButtonSize,
  {
    height: number;
    paddingHorizontal: number;
    iconSize: number;
    typographyKey: keyof AppTheme['typography'];
  }
> = {
  sm: {
    height: s(36),
    paddingHorizontal: s(16),
    iconSize: s(16),
    typographyKey: 'labelMedium',
  },
  md: {
    height: s(48),
    paddingHorizontal: s(24),
    iconSize: s(18),
    typographyKey: 'labelLarge',
  },
  lg: {
    height: s(56),
    paddingHorizontal: s(32),
    iconSize: s(20),
    typographyKey: 'labelLarge',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export function AppButton({
  label,
  onPress,
  variant = 'filled',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  gradient = false,
  style,
  labelStyle,
}: AppButtonProps) {
  const { colors, spacing, radius, touchTarget, animations } = useAppTheme();

  // ---- Animation ----
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // ---- Size config ----
  const sizeConfig = SIZE_CONFIG[size];

  // ---- Variant styles ----
  const variantStyles = useMemo(() => {
    const base: {
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      textColor: string;
      loaderColor: string;
    } = {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
      textColor: colors.primary,
      loaderColor: colors.primary,
    };

    switch (variant) {
      case 'filled':
        base.backgroundColor = colors.primary;
        base.textColor = colors.onPrimary;
        base.loaderColor = colors.onPrimary;
        break;
      case 'outlined':
        base.borderColor = colors.outline;
        base.borderWidth = 1;
        base.textColor = colors.primary;
        base.loaderColor = colors.primary;
        break;
      case 'text':
        // all defaults are fine
        break;
      case 'tonal':
        base.backgroundColor = colors.primaryContainer;
        base.textColor = colors.onPrimaryContainer;
        base.loaderColor = colors.onPrimaryContainer;
        break;
    }

    return base;
  }, [variant, colors]);

  // ---- Haptic feedback ----
  const triggerHaptic = useCallback(() => {
    if (variant === 'filled' || variant === 'tonal') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [variant]);

  // ---- Press handlers ----
  const handlePressIn = useCallback(() => {
    if (disabled || loading) return;
    scale.value = withSpring(animations.scalePresets.buttonPress, {
      damping: animations.springs.snappy.damping,
      stiffness: animations.springs.snappy.stiffness,
      mass: animations.springs.snappy.mass,
    });
  }, [disabled, loading, scale, animations]);

  const handlePressOut = useCallback(() => {
    if (disabled || loading) return;
    scale.value = withSpring(1, {
      damping: animations.springs.snappy.damping,
      stiffness: animations.springs.snappy.stiffness,
      mass: animations.springs.snappy.mass,
    });
  }, [disabled, loading, scale, animations]);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled || loading) return;
      triggerHaptic();
      onPress?.(event);
    },
    [disabled, loading, triggerHaptic, onPress],
  );

  // ---- Computed minimum height ----
  const minHeight = Math.max(sizeConfig.height, touchTarget.min);

  // ---- Use gradient? ----
  const useGradient = gradient && variant === 'filled';

  // ---- Render content ----
  const iconGap = spacing.sm;

  const renderContent = () => (
    <View style={styles.contentRow}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.loaderColor}
          style={styles.loader}
        />
      ) : (
        <>
          {leftIcon && (
            <Feather
              name={leftIcon}
              size={sizeConfig.iconSize}
              color={variantStyles.textColor}
              style={{ marginRight: iconGap }}
            />
          )}
          <Text
            style={[
              {
                color: variantStyles.textColor,
                fontSize: SIZE_CONFIG[size].typographyKey === 'labelLarge' ? s(14) : s(12),
                lineHeight: SIZE_CONFIG[size].typographyKey === 'labelLarge' ? s(20) : s(16),
                fontWeight: '600',
                letterSpacing: SIZE_CONFIG[size].typographyKey === 'labelLarge' ? 0.1 : 0.5,
              },
              labelStyle,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {rightIcon && (
            <Feather
              name={rightIcon}
              size={sizeConfig.iconSize}
              color={variantStyles.textColor}
              style={{ marginLeft: iconGap }}
            />
          )}
        </>
      )}
    </View>
  );

  // ---- Container style ----
  const containerStyle: ViewStyle = {
    minHeight,
    height: sizeConfig.height,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    borderRadius: radius.md,
    backgroundColor: useGradient ? 'transparent' : variantStyles.backgroundColor,
    borderColor: variantStyles.borderColor,
    borderWidth: variantStyles.borderWidth,
    alignSelf: fullWidth ? 'stretch' : 'center',
    opacity: disabled ? 0.5 : 1,
    overflow: 'hidden',
  };

  // ---- Render ----
  if (useGradient) {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        style={[animatedStyle, containerStyle, style]}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        accessibilityLabel={label}
      >
        <LinearGradient
          colors={colors.gradient.primary as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.gradientFill, { borderRadius: radius.md }]}
        />
        {renderContent()}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[animatedStyle, containerStyle, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      accessibilityLabel={label}
    >
      {renderContent()}
    </AnimatedPressable>
  );
}

// ============================================================
// STATIC STYLES
// ============================================================

const styles = StyleSheet.create({
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginHorizontal: 4,
  },
  gradientFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default AppButton;
