import React, { useMemo } from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { s } from 'react-native-size-matters';
import { useAppTheme } from '@/theme';

// ============================================================
// APP HEADER
// Collapsible gradient header for screen tops.
//
// Usage:
//   <AppHeader
//     title="Tableau de bord"
//     subtitle="Bienvenue, Agent"
//     showAvatar
//     agentName="John Doe"
//     scrollY={scrollY}
//     rightActions={<SyncButton />}
//   />
// ============================================================

// ============================================================
// CONSTANTS
// ============================================================

const HEADER_EXPANDED = 140;
const HEADER_COLLAPSED = 64;
const SCROLL_THRESHOLD = 100;

// ============================================================
// TYPES
// ============================================================

export interface AppHeaderProps {
  /** Primary header title */
  title: string;
  /** Optional subtitle below title */
  subtitle?: string;
  /** Slot for action buttons on the right (sync, settings, etc.) */
  rightActions?: React.ReactNode;
  /** Show avatar circle with agent initials */
  showAvatar?: boolean;
  /** Full name for initials extraction (e.g. "John Doe" -> "JD") */
  agentName?: string;
  /** Animated scroll offset for collapse animation. If omitted, header stays expanded. */
  scrollY?: SharedValue<number>;
}

// ============================================================
// HELPERS
// ============================================================

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ============================================================
// COMPONENT
// ============================================================

export function AppHeader({
  title,
  subtitle,
  rightActions,
  showAvatar = false,
  agentName,
  scrollY,
}: AppHeaderProps) {
  const { colors, spacing, radius, elevation, typography } = useAppTheme();
  const insets = useSafeAreaInsets();

  const initials = useMemo(() => {
    if (showAvatar && agentName) return getInitials(agentName);
    return '';
  }, [showAvatar, agentName]);

  // ---- Animated header height ----
  const headerAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { height: HEADER_EXPANDED + insets.top };
    }
    const headerHeight = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [HEADER_EXPANDED + insets.top, HEADER_COLLAPSED + insets.top],
      Extrapolation.CLAMP,
    );
    return { height: headerHeight };
  });

  // ---- Animated title scale ----
  const titleAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { transform: [{ scale: 1 }] };
    }
    const scale = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [1, 0.78],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale }],
      transformOrigin: 'left center',
    };
  });

  // ---- Animated subtitle fade ----
  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { opacity: 1, height: undefined };
    }
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.5],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.5],
      [typography.bodyMedium.lineHeight + 4, 0],
      Extrapolation.CLAMP,
    );
    return { opacity, height };
  });

  // ---- Shadow style ----
  const shadowStyle: ViewStyle = {
    ...elevation.lg,
  };

  return (
    <Animated.View style={[styles.wrapper, shadowStyle, headerAnimatedStyle]}>
      <LinearGradient
        colors={colors.gradient.primary as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          StyleSheet.absoluteFill,
          { borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
        ]}
      />

      {/* Content area */}
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + spacing.sm,
            paddingHorizontal: spacing.xl,
            paddingBottom: spacing.lg,
          },
        ]}
      >
        {/* Left: title + subtitle */}
        <View style={styles.textContainer}>
          <Animated.Text
            style={[
              styles.title,
              {
                fontSize: typography.displayMedium.fontSize,
                lineHeight: typography.displayMedium.lineHeight,
                fontWeight: typography.displayMedium.fontWeight,
                letterSpacing: typography.displayMedium.letterSpacing,
                color: '#FFFFFF',
              },
              titleAnimatedStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Animated.Text>

          {subtitle ? (
            <Animated.Text
              style={[
                styles.subtitle,
                {
                  fontSize: typography.bodyMedium.fontSize,
                  lineHeight: typography.bodyMedium.lineHeight,
                  fontWeight: typography.bodyMedium.fontWeight,
                  letterSpacing: typography.bodyMedium.letterSpacing,
                  color: 'rgba(255, 255, 255, 0.8)',
                },
                subtitleAnimatedStyle,
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Animated.Text>
          ) : null}
        </View>

        {/* Right: actions + avatar */}
        <View style={styles.rightContainer}>
          {rightActions}
          {showAvatar && initials ? (
            <View
              style={[
                styles.avatarCircle,
                {
                  width: s(40),
                  height: s(40),
                  borderRadius: s(20),
                  marginLeft: rightActions ? spacing.sm : 0,
                },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  {
                    fontSize: typography.labelLarge.fontSize,
                    fontWeight: '700',
                    color: colors.primary,
                  },
                ]}
              >
                {initials}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}

// ============================================================
// STATIC STYLES
// ============================================================

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 12,
  },
  title: {
    // dynamic styles applied inline
  },
  subtitle: {
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
  },
  avatarCircle: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    // dynamic styles applied inline
  },
});

export default AppHeader;
