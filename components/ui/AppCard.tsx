import React, { useCallback } from 'react';
import { Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAppTheme, type AppTheme } from '@/theme';

// ============================================================
// AppCard - Composant carte reutilisable
// Variants: elevated, filled, outlined (Material Design 3)
// ============================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SpacingKey = keyof AppTheme['spacing'];

interface AppCardProps {
  /** Visual variant following MD3 surface styles */
  variant?: 'elevated' | 'filled' | 'outlined';
  /** Card content */
  children: React.ReactNode;
  /** Additional styles applied to the card container */
  style?: StyleProp<ViewStyle>;
  /** Press handler - enables pressable behavior with scale animation and haptic feedback */
  onPress?: () => void;
  /** Padding using a spacing token key (defaults to 'lg') */
  padding?: SpacingKey;
  /** Enable entrance animation using reanimated FadeInUp */
  animated?: boolean;
  /** Stagger index for entrance animation delay (multiplied by 60ms) */
  index?: number;
}

export function AppCard({
  variant = 'elevated',
  children,
  style,
  onPress,
  padding = 'lg',
  animated = false,
  index = 0,
}: AppCardProps) {
  const { colors, spacing, radius, elevation, animations } = useAppTheme();

  const scale = useSharedValue(1);

  const animatedScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(animations.scalePresets.cardPress, animations.springs.bouncy);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [scale, animations]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, animations.springs.bouncy);
  }, [scale, animations]);

  // --- Variant styles ---
  const variantStyle = React.useMemo((): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          ...elevation.md,
        };
      case 'filled':
        return {
          backgroundColor: colors.surfaceContainerHigh,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
        };
      default:
        return {
          backgroundColor: colors.surface,
          ...elevation.md,
        };
    }
  }, [variant, colors, elevation]);

  // --- Base card style ---
  const cardStyle: ViewStyle = {
    borderRadius: radius.lg,
    padding: spacing[padding],
    overflow: 'hidden',
    ...variantStyle,
  };

  // --- Entering animation ---
  const entering = animated
    ? FadeInUp.delay(index * 60).springify().damping(18)
    : undefined;

  // --- Pressable card ---
  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        entering={entering}
        style={[cardStyle, animatedScaleStyle, style]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  // --- Static card ---
  return (
    <Animated.View entering={entering} style={[cardStyle, style]}>
      {children}
    </Animated.View>
  );
}

export default AppCard;
