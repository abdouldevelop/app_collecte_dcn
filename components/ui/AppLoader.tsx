// ============================================================
// AppLoader - Loader animé professionnel
// Variantes : "ring" (anneau rotatif) et "dots" (points pulsants)
// 60fps, react-native-reanimated
// ============================================================

import React, { useEffect } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { useAppTheme } from '@/theme';

type LoaderVariant = 'ring' | 'dots';

export interface AppLoaderProps {
  /** Taille en pixels (diamètre de l'anneau / des points) */
  size?: number;
  /** Couleur (par défaut : primaire du thème) */
  color?: string;
  /** Style visuel */
  variant?: LoaderVariant;
  /** Style conteneur */
  style?: StyleProp<ViewStyle>;
}

// ── Anneau rotatif avec piste de fond ──────────────────────
function RingLoader({ size = 28, color }: { size: number; color: string }) {
  const rotation = useSharedValue(0);
  const borderWidth = Math.max(2, Math.round(size / 9));

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 850, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(rotation);
  }, [rotation]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      {/* Piste de fond (anneau discret) */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor: color,
          opacity: 0.18,
        }}
      />
      {/* Arc rotatif */}
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth,
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: color,
          },
          spinStyle,
        ]}
      />
    </View>
  );
}

// ── Un point pulsant (décalé dans le temps) ────────────────
function PulseDot({
  index,
  color,
  dotSize,
}: {
  index: number;
  color: string;
  dotSize: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 160,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 420, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(progress);
  }, [index, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.3 + progress.value * 0.7,
    transform: [{ scale: 0.65 + progress.value * 0.35 }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

function DotsLoader({ size = 28, color }: { size: number; color: string }) {
  const dotSize = Math.max(6, Math.round(size / 3.2));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: dotSize / 2 }}>
      {[0, 1, 2].map((i) => (
        <PulseDot key={i} index={i} color={color} dotSize={dotSize} />
      ))}
    </View>
  );
}

export function AppLoader({
  size = 28,
  color,
  variant = 'ring',
  style,
}: AppLoaderProps) {
  const { colors } = useAppTheme();
  const resolvedColor = color ?? colors.primary;

  return (
    <View
      style={[{ alignItems: 'center', justifyContent: 'center' }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel="Chargement"
    >
      {variant === 'dots' ? (
        <DotsLoader size={size} color={resolvedColor} />
      ) : (
        <RingLoader size={size} color={resolvedColor} />
      )}
    </View>
  );
}

export default AppLoader;
