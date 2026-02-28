import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, Text, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '@/theme';

// ============================================================
// APP TAB BAR
// Custom bottom tab bar for expo-router Tabs.
//
// Usage:
//   <Tabs tabBar={(props) => <AppTabBar {...props} />}>
// ============================================================

const TAB_BAR_HEIGHT = 70;

// ============================================================
// ANIMATED TAB ITEM
// ============================================================

interface TabItemProps {
  label: string;
  icon: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: 'button';
  accessibilityState?: { selected: boolean };
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabItem({
  label,
  icon,
  isFocused,
  onPress,
  onLongPress,
  accessibilityLabel,
}: TabItemProps) {
  const { colors, typography, animations } = useAppTheme();
  const focusProgress = useSharedValue(isFocused ? 1 : 0);

  // Animate when focus state changes
  React.useEffect(() => {
    focusProgress.value = withSpring(isFocused ? 1 : 0, animations.springs.bouncy);
  }, [isFocused, focusProgress, animations.springs.bouncy]);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(focusProgress.value, [0, 1], [1, 1.15]);
    const translateY = interpolate(focusProgress.value, [0, 1], [0, -2]);
    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(focusProgress.value, [0, 1], [0, 1]);
    const opacity = interpolate(focusProgress.value, [0, 0.5, 1], [0, 0.5, 1]);
    return {
      transform: [{ scaleX: scale }, { scaleY: scale }],
      opacity,
    };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(focusProgress.value, [0, 1], [0.7, 1]);
    return { opacity };
  });

  const activeColor = isFocused ? colors.primary : colors.onSurfaceVariant;

  const handlePress = useCallback(() => {
    Haptics.selectionAsync();
    onPress();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={accessibilityLabel}
      style={styles.tabItem}
    >
      <View style={styles.iconContainer}>
        {/* Active indicator pill */}
        <Animated.View
          style={[
            styles.activeIndicator,
            { backgroundColor: colors.primaryContainer },
            indicatorAnimatedStyle,
          ]}
        />
        {/* Icon */}
        <Animated.View style={iconAnimatedStyle}>
          {icon({ focused: isFocused, color: activeColor, size: 24 })}
        </Animated.View>
      </View>
      {/* Label */}
      <Animated.Text
        style={[
          styles.label,
          {
            color: activeColor,
            fontSize: typography.labelSmall.fontSize,
            lineHeight: typography.labelSmall.lineHeight,
            fontWeight: typography.labelSmall.fontWeight,
            letterSpacing: typography.labelSmall.letterSpacing,
          },
          labelAnimatedStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

// ============================================================
// MAIN TAB BAR COMPONENT
// ============================================================

export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, dark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const totalHeight = TAB_BAR_HEIGHT + insets.bottom;

  return (
    <View
      style={[
        styles.container,
        {
          height: totalHeight,
          paddingBottom: insets.bottom,
          borderTopColor: colors.outlineVariant,
        },
      ]}
    >
      {/* Blur background */}
      <BlurView
        intensity={80}
        tint={dark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />

      {/* Surface overlay for consistent color */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.surface, opacity: 0.85 },
        ]}
      />

      {/* Tab items */}
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Resolve label
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
                ? options.title
                : route.name;

          // Resolve icon renderer
          const renderIcon = options.tabBarIcon ?? (() => null);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabItem
              key={route.key}
              label={label}
              icon={renderIcon}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            />
          );
        })}
      </View>
    </View>
  );
}

// ============================================================
// STATIC STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    overflow: 'hidden',
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    gap: 2,
  },
  iconContainer: {
    width: 48,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    width: 48,
    height: 32,
    borderRadius: 16,
  },
  label: {
    marginTop: 2,
  },
});

export default AppTabBar;
