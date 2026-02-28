import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { s } from 'react-native-size-matters';
import { useAppTheme } from '@/theme';

// ============================================================
// AppProgressBar - Barre de progression animee
// Couleurs dynamiques selon le pourcentage ou couleur custom
// ============================================================

export interface AppProgressBarProps {
  /** Progress value from 0 to 100 */
  progress: number;
  /** Custom fill color (overrides automatic color based on progress) */
  color?: string;
  /** Show percentage label on the right */
  showLabel?: boolean;
  /** Track height in points (default 8) */
  height?: number;
  /** Animate the width change (default true) */
  animated?: boolean;
}

export function AppProgressBar({
  progress,
  color,
  showLabel = false,
  height = 8,
  animated = true,
}: AppProgressBarProps) {
  const { colors, spacing, radius, typography, animations } = useAppTheme();

  // Clamp progress to [0, 100]
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // ── Determine fill color based on progress thresholds ─────
  const fillColor = useMemo(() => {
    if (color) return color;
    if (clampedProgress < 30) return colors.error;
    if (clampedProgress <= 70) return colors.warning;
    return colors.success;
  }, [color, clampedProgress, colors.error, colors.warning, colors.success]);

  // ── Animated fill width ────────────────────────────────────
  const animatedFillStyle = useAnimatedStyle(() => {
    const widthPercent = animated
      ? withTiming(clampedProgress, { duration: animations.durations.normal })
      : clampedProgress;

    return {
      width: `${interpolate(widthPercent, [0, 100], [0, 100])}%` as any,
    };
  }, [clampedProgress, animated, animations.durations.normal]);

  const scaledHeight = s(height);

  return (
    <View style={styles.container}>
      {/* Background Track */}
      <View
        style={[
          styles.track,
          {
            height: scaledHeight,
            borderRadius: scaledHeight / 2,
            backgroundColor: colors.surfaceContainerHigh,
          },
        ]}
      >
        {/* Fill Bar */}
        <Animated.View
          style={[
            styles.fill,
            {
              height: scaledHeight,
              borderRadius: scaledHeight / 2,
              backgroundColor: fillColor,
            },
            animatedFillStyle,
          ]}
        />
      </View>

      {/* Optional Label */}
      {showLabel && (
        <Text
          style={[
            typography.labelSmall,
            {
              color: colors.onSurfaceVariant,
              marginLeft: spacing.sm,
              minWidth: s(36),
              textAlign: 'right',
            },
          ]}
        >
          {Math.round(clampedProgress)}%
        </Text>
      )}
    </View>
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
  track: {
    flex: 1,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
});

export default AppProgressBar;
