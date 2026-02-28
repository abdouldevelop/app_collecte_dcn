import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useAppTheme, type AppTheme } from '@/theme';

// ============================================================
// AppBadge - Composant badge polyvalent
// Variants: status (dot + label), count (circular), label (pill)
// ============================================================

type BadgeVariant = 'status' | 'count' | 'label';
type BadgeColor = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';
type BadgeSize = 'sm' | 'md';

interface AppBadgeProps {
  /** Text or number displayed in the badge */
  label: string | number;
  /** Badge visual variant */
  variant?: BadgeVariant;
  /** Semantic color */
  color?: BadgeColor;
  /** Badge size preset */
  size?: BadgeSize;
  /** Enable entrance animation (ZoomIn spring) */
  animated?: boolean;
  /** Additional styles applied to the badge container */
  style?: StyleProp<ViewStyle>;
}

interface ColorMapping {
  bg: string;
  text: string;
}

/**
 * Resolves the background and text colors based on the semantic color prop.
 */
function getColorMapping(color: BadgeColor, colors: AppTheme['colors']): ColorMapping {
  switch (color) {
    case 'success':
      return { bg: colors.successContainer, text: colors.success };
    case 'warning':
      return { bg: colors.warningContainer, text: colors.warning };
    case 'error':
      return { bg: colors.errorContainer, text: colors.error };
    case 'info':
      return { bg: colors.accent.blueBg, text: colors.accent.blue };
    case 'neutral':
      return { bg: colors.surfaceVariant, text: colors.onSurfaceVariant };
    case 'primary':
      return { bg: colors.primaryContainer, text: colors.primary };
    default:
      return { bg: colors.surfaceVariant, text: colors.onSurfaceVariant };
  }
}

/**
 * Returns size-dependent dimensions and typography.
 */
function getSizeConfig(size: BadgeSize, typography: AppTheme['typography']) {
  if (size === 'sm') {
    return {
      height: 20,
      fontSize: typography.caption.fontSize,
      lineHeight: typography.caption.lineHeight,
      fontWeight: typography.caption.fontWeight,
      horizontalPadding: 6,
      dotSize: 6,
    };
  }
  // md
  return {
    height: 28,
    fontSize: typography.labelSmall.fontSize,
    lineHeight: typography.labelSmall.lineHeight,
    fontWeight: typography.labelSmall.fontWeight,
    horizontalPadding: 8,
    dotSize: 8,
  };
}

export function AppBadge({
  label,
  variant = 'label',
  color = 'neutral',
  size = 'sm',
  animated = false,
  style,
}: AppBadgeProps) {
  const { colors, radius, spacing, typography } = useAppTheme();

  const colorMapping = useMemo(() => getColorMapping(color, colors), [color, colors]);
  const sizeConfig = useMemo(() => getSizeConfig(size, typography), [size, typography]);

  const displayLabel = String(label);

  // --- Entering animation ---
  const entering = animated ? ZoomIn.springify().damping(14) : undefined;

  // --- Build variant-specific styles ---
  const { containerStyle, textStyle, dotElement } = useMemo(() => {
    const baseContainer: ViewStyle = {
      backgroundColor: colorMapping.bg,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    };

    const baseText: TextStyle = {
      color: colorMapping.text,
      fontSize: sizeConfig.fontSize,
      fontWeight: sizeConfig.fontWeight as TextStyle['fontWeight'],
      includeFontPadding: false,
      textAlignVertical: 'center',
    };

    let container: ViewStyle;
    let text: TextStyle;
    let dot: React.ReactNode = null;

    switch (variant) {
      case 'status': {
        container = {
          ...baseContainer,
          flexDirection: 'row',
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.horizontalPadding,
          borderRadius: radius.full,
          gap: spacing.xs,
        };
        text = { ...baseText };
        dot = (
          <View
            style={{
              width: sizeConfig.dotSize,
              height: sizeConfig.dotSize,
              borderRadius: radius.full,
              backgroundColor: colorMapping.text,
            }}
          />
        );
        break;
      }

      case 'count': {
        // Circular badge: minWidth === height for single digits, expands for multi-digit
        container = {
          ...baseContainer,
          height: sizeConfig.height,
          minWidth: sizeConfig.height,
          paddingHorizontal: sizeConfig.horizontalPadding,
          borderRadius: radius.full,
        };
        text = { ...baseText };
        break;
      }

      case 'label':
      default: {
        container = {
          ...baseContainer,
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.horizontalPadding + 2,
          borderRadius: radius.full,
        };
        text = { ...baseText };
        break;
      }
    }

    return { containerStyle: container, textStyle: text, dotElement: dot };
  }, [variant, colorMapping, sizeConfig, radius, spacing]);

  // --- Render with or without animation ---
  const content = (
    <>
      {dotElement}
      <Text style={textStyle} allowFontScaling={false} numberOfLines={1}>
        {displayLabel}
      </Text>
    </>
  );

  if (animated) {
    return (
      <Animated.View entering={entering} style={[containerStyle, style]}>
        {content}
      </Animated.View>
    );
  }

  return <View style={[containerStyle, style]}>{content}</View>;
}

export default AppBadge;
