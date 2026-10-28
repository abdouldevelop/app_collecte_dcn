// ============================================================
// SyncBanner - Bandeau de synchronisation animé (non bloquant)
// Glisse depuis le haut avec un loader pro, puis se retire.
// Piloté par le store global useSyncStore.
// ============================================================

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme';
import { AppLoader } from '@/components/ui';
import { useSyncStore } from '@/storage/syncStore';

export default function SyncBanner() {
  const { colors, spacing, radius, typography, elevation } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { status, message, reset } = useSyncStore();

  // 0 = caché (au-dessus de l'écran), 1 = visible
  const progress = useSharedValue(0);

  useEffect(() => {
    if (status === 'idle') return;

    // Entrée
    progress.value = withSpring(1, { damping: 18, stiffness: 180, mass: 0.9 });

    // Sortie auto pour les états terminaux
    if (status === 'success' || status === 'error') {
      const timeout = setTimeout(() => {
        progress.value = withTiming(
          0,
          { duration: 260, easing: Easing.in(Easing.quad) },
          (finished) => {
            if (finished) runOnJS(reset)();
          },
        );
      }, status === 'success' ? 1400 : 2600);
      return () => clearTimeout(timeout);
    }
  }, [status, progress, reset]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * -24 },
      { scale: 0.96 + progress.value * 0.04 },
    ],
  }));

  if (status === 'idle') return null;

  const isSyncing = status === 'syncing';
  const isError = status === 'error';

  const accent = isError
    ? colors.error
    : status === 'success'
      ? colors.success
      : colors.primary;

  const bg = isError
    ? colors.errorContainer
    : status === 'success'
      ? colors.successContainer
      : colors.surface;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: insets.top + spacing.sm,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            backgroundColor: bg,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.lg,
            borderRadius: radius.full,
            ...elevation.md,
          },
          animatedStyle,
        ]}
      >
        {isSyncing ? (
          <AppLoader variant="dots" size={20} color={accent} />
        ) : (
          <Feather
            name={isError ? 'alert-circle' : 'check-circle'}
            size={18}
            color={accent}
          />
        )}
        <Text
          style={[
            typography.labelMedium,
            { color: isSyncing ? colors.onSurface : accent },
          ]}
        >
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}
