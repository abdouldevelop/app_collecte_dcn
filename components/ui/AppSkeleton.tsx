import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/theme';

// ============================================================
// APP SKELETON
// Skeleton loading placeholder with shimmer animation.
//
// Usage:
//   <AppSkeleton variant="text" lines={3} />
//   <AppSkeleton variant="circle" width={48} height={48} />
//   <AppSkeleton variant="rect" width="100%" height={120} />
//   <AppSkeleton variant="card" />
// ============================================================

// ============================================================
// TYPES
// ============================================================

export type SkeletonVariant = 'text' | 'circle' | 'rect' | 'card';

export interface AppSkeletonProps {
  /** Width of the skeleton. Number (pixels) or string (e.g. "100%"). */
  width?: number | string;
  /** Height of the skeleton in pixels. */
  height?: number;
  /** Visual variant determining shape and layout. */
  variant?: SkeletonVariant;
  /** Number of text lines to render (only for "text" variant). */
  lines?: number;
  /** Gap between text lines in pixels. */
  gap?: number;
}

// ============================================================
// SHIMMER CONSTANTS
// ============================================================

const SHIMMER_DURATION = 1500;
const SHIMMER_GRADIENT_COLORS = [
  'transparent',
  'rgba(255, 255, 255, 0.3)',
  'transparent',
] as const;

// ============================================================
// SHIMMER OVERLAY
// ============================================================

interface ShimmerOverlayProps {
  width: number;
}

function ShimmerOverlayInner({ width }: ShimmerOverlayProps) {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, {
        duration: SHIMMER_DURATION,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [width, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.shimmerContainer, animatedStyle]}>
      <LinearGradient
        colors={SHIMMER_GRADIENT_COLORS as unknown as [string, string, ...string[]]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.shimmerGradient, { width }]}
      />
    </Animated.View>
  );
}

const ShimmerOverlay = React.memo(ShimmerOverlayInner);

// ============================================================
// SKELETON BONE (single shape)
// ============================================================

interface BoneProps {
  width: number | string;
  height: number;
  borderRadius: number;
  style?: ViewStyle;
}

function BoneInner({ width: boneWidth, height, borderRadius, style }: BoneProps) {
  const { colors } = useAppTheme();
  const { width: screenWidth } = useWindowDimensions();

  // Resolve numeric width for shimmer
  const resolvedWidth = typeof boneWidth === 'number' ? boneWidth : screenWidth;

  return (
    <View
      style={[
        styles.bone,
        {
          width: boneWidth,
          height,
          borderRadius,
          backgroundColor: colors.surfaceContainerHigh,
        },
        style,
      ]}
    >
      <ShimmerOverlay width={resolvedWidth} />
    </View>
  );
}

const Bone = React.memo(BoneInner);

// ============================================================
// VARIANT RENDERERS
// ============================================================

function TextSkeleton({
  width,
  height = 14,
  lines = 1,
  gap = 10,
}: Pick<AppSkeletonProps, 'width' | 'height' | 'lines' | 'gap'>) {
  const { radius } = useAppTheme();

  const lineElements = useMemo(() => {
    const items: React.ReactElement[] = [];
    const count = Math.max(1, lines ?? 1);
    for (let i = 0; i < count; i++) {
      const isLast = i === count - 1 && count > 1;
      const lineWidth = isLast ? '60%' : (width ?? '100%');
      items.push(
        <Bone
          key={i}
          width={lineWidth}
          height={height ?? 14}
          borderRadius={radius.sm}
          style={i > 0 ? { marginTop: gap } : undefined}
        />,
      );
    }
    return items;
  }, [width, height, lines, gap, radius.sm]);

  return <View>{lineElements}</View>;
}

function CircleSkeleton({
  width = 48,
  height,
}: Pick<AppSkeletonProps, 'width' | 'height'>) {
  const { radius } = useAppTheme();
  const size = typeof width === 'number' ? width : 48;
  return <Bone width={size} height={height ?? size} borderRadius={radius.full} />;
}

function RectSkeleton({
  width = '100%',
  height = 80,
}: Pick<AppSkeletonProps, 'width' | 'height'>) {
  const { radius } = useAppTheme();
  return <Bone width={width} height={height} borderRadius={radius.md} />;
}

function CardSkeleton() {
  const { radius, spacing, colors } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: radius.lg,
          backgroundColor: colors.surfaceContainerHigh,
          padding: spacing.lg,
        },
      ]}
    >
      {/* Row: circle + text */}
      <View style={styles.cardRow}>
        <Bone width={40} height={40} borderRadius={radius.full} />
        <View style={[styles.cardTextGroup, { marginLeft: spacing.md }]}>
          <Bone width="70%" height={14} borderRadius={radius.sm} />
          <Bone
            width="50%"
            height={12}
            borderRadius={radius.sm}
            style={{ marginTop: spacing.sm }}
          />
          <Bone
            width="85%"
            height={12}
            borderRadius={radius.sm}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </View>
    </View>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function AppSkeletonInner({
  width,
  height,
  variant = 'rect',
  lines,
  gap,
}: AppSkeletonProps) {
  switch (variant) {
    case 'text':
      return <TextSkeleton width={width} height={height} lines={lines} gap={gap} />;
    case 'circle':
      return <CircleSkeleton width={width} height={height} />;
    case 'card':
      return <CardSkeleton />;
    case 'rect':
    default:
      return <RectSkeleton width={width} height={height} />;
  }
}

export const AppSkeleton = React.memo(AppSkeletonInner);

// ============================================================
// STATIC STYLES
// ============================================================

const styles = StyleSheet.create({
  bone: {
    overflow: 'hidden',
  },
  shimmerContainer: {
    overflow: 'hidden',
  },
  shimmerGradient: {
    height: '100%',
  },
  card: {
    width: '100%',
    minHeight: 120,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardTextGroup: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default AppSkeleton;
