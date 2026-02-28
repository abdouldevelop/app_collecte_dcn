import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';
import QRScannerCompo from '@/features/scanner';

// ============================================================
// CONSTANTS
// ============================================================

const SCANNER_FRAME_SIZE = 220;

// ============================================================
// COMPONENT
// ============================================================

export default function Page() {
  const { colors, spacing, radius, typography, elevation } = useAppTheme();
  const [isShowingScanner, setIsShowingScanner] = React.useState(false);

  // --- Animation shared values ---
  const scanLinePosition = useSharedValue(0);
  const cornerPulse = useSharedValue(1);

  // --- Initialize animations ---
  useEffect(() => {
    // Scan line: translates from top to bottom, repeats
    scanLinePosition.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );

    // Corner pulse: scale 1 -> 1.1 -> 1, repeats
    cornerPulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  // --- Handle scanner toggle ---
  const handleSwitchScanner = (isShow: boolean) => {
    setIsShowingScanner(isShow);
  };

  // --- Animated styles ---
  const animatedScanLine = useAnimatedStyle(() => {
    const translateY = interpolate(
      scanLinePosition.value,
      [0, 1],
      [0, SCANNER_FRAME_SIZE - 4]
    );
    return {
      transform: [{ translateY }],
      opacity: interpolate(scanLinePosition.value, [0, 0.5, 1], [0.6, 1, 0.6]),
    };
  });

  const animatedCornerPulse = useAnimatedStyle(() => ({
    transform: [{ scale: cornerPulse.value }],
  }));

  // --- Scanner mode ---
  if (isShowingScanner) {
    return <QRScannerCompo handleClose={() => handleSwitchScanner(false)} />;
  }

  // --- Corner indicator styles ---
  const cornerBase: object = {
    position: 'absolute' as const,
    width: 28,
    height: 28,
  };

  const cornerBorder = {
    borderColor: colors.primary,
    borderWidth: 3,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <AppHeader
        title="Scanner"
        subtitle="Scannez le QR code du client"
      />

      {/* Main content area */}
      <View style={[styles.mainContent, { paddingHorizontal: spacing.xl }]}>

        {/* Scanner card */}
        <AppCard
          variant="elevated"
          padding="xl"
          style={[styles.scannerCard, { alignItems: 'center' as const }]}
        >
          {/* Scanner frame */}
          <View
            style={[
              styles.scannerFrame,
              {
                width: SCANNER_FRAME_SIZE,
                height: SCANNER_FRAME_SIZE,
                borderRadius: radius.xl,
                backgroundColor: colors.surfaceContainerLow,
              },
            ]}
          >
            {/* Corner indicators */}
            <Animated.View
              style={[
                animatedCornerPulse,
                cornerBase,
                cornerBorder,
                {
                  top: 12,
                  left: 12,
                  borderBottomWidth: 0,
                  borderRightWidth: 0,
                  borderTopLeftRadius: radius.sm,
                },
              ]}
            />
            <Animated.View
              style={[
                animatedCornerPulse,
                cornerBase,
                cornerBorder,
                {
                  top: 12,
                  right: 12,
                  borderBottomWidth: 0,
                  borderLeftWidth: 0,
                  borderTopRightRadius: radius.sm,
                },
              ]}
            />
            <Animated.View
              style={[
                animatedCornerPulse,
                cornerBase,
                cornerBorder,
                {
                  bottom: 12,
                  left: 12,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                  borderBottomLeftRadius: radius.sm,
                },
              ]}
            />
            <Animated.View
              style={[
                animatedCornerPulse,
                cornerBase,
                cornerBorder,
                {
                  bottom: 12,
                  right: 12,
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderBottomRightRadius: radius.sm,
                },
              ]}
            />

            {/* Scan line */}
            <Animated.View style={[styles.scanLine, animatedScanLine]}>
              <LinearGradient
                colors={['transparent', colors.primary, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.scanLineGradient}
              />
            </Animated.View>

            {/* Center QR icon */}
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={64}
              color={colors.outlineVariant}
            />
          </View>
        </AppCard>

        {/* Instruction text */}
        <Animated.Text
          entering={FadeIn.delay(200)}
          style={[
            styles.instructionText,
            {
              ...typography.bodyMedium,
              color: colors.onSurfaceVariant,
              marginTop: spacing.xl,
              marginBottom: spacing.xl,
            },
          ]}
        >
          Placez le code QR du client dans le cadre pour le scanner
        </Animated.Text>

        {/* Scan button */}
        <AppButton
          variant="filled"
          gradient
          fullWidth
          label="Scanner QR Code"
          leftIcon="camera"
          onPress={() => handleSwitchScanner(true)}
        />
      </View>

      {/* Footer */}
      <Animated.View
        entering={FadeIn.delay(400)}
        style={[
          styles.footer,
          {
            paddingVertical: spacing.lg,
            paddingBottom: 70 + spacing.lg,
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Text
          style={[
            typography.bodySmall,
            { color: colors.onSurfaceVariant, marginRight: spacing.xs },
          ]}
        >
          Traitement securise des donnees
        </Text>
        <Ionicons name="shield-checkmark" size={16} color={colors.success} />
      </Animated.View>
    </SafeAreaView>
  );
}

// ============================================================
// STATIC STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerCard: {
    width: '100%',
  },
  scannerFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    zIndex: 1,
  },
  scanLineGradient: {
    flex: 1,
    borderRadius: 1,
  },
  instructionText: {
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
