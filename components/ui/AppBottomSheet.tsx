import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { s } from 'react-native-size-matters';
import { useAppTheme } from '@/theme';

// ============================================================
// AppBottomSheet - Wrapper autour de @gorhom/bottom-sheet
// BottomSheetModal avec handle, titre, backdrop et scroll
// ============================================================

export interface AppBottomSheetProps {
  /** Content rendered inside the bottom sheet */
  children: React.ReactNode;
  /** Snap points for the sheet (e.g. ['25%', '50%', '90%']) */
  snapPoints: string[];
  /** Optional title displayed below the handle */
  title?: string;
  /** Called when the sheet is dismissed */
  onDismiss?: () => void;
}

// ────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────

const HANDLE_WIDTH = s(36);
const HANDLE_HEIGHT = s(4);

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export const AppBottomSheet = forwardRef<BottomSheetModal, AppBottomSheetProps>(
  ({ children, snapPoints, title, onDismiss }, ref) => {
    const { colors, spacing, radius, typography } = useAppTheme();

    // ── Custom backdrop ──────────────────────────────────────
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.32}
          pressBehavior="close"
          style={[props.style, { backgroundColor: colors.scrim }]}
        />
      ),
      [colors.scrim],
    );

    // ── Custom handle indicator ──────────────────────────────
    const renderHandle = useCallback(
      () => (
        <View style={styles.handleContainer}>
          <View
            style={[
              styles.handleIndicator,
              {
                width: HANDLE_WIDTH,
                height: HANDLE_HEIGHT,
                borderRadius: HANDLE_HEIGHT / 2,
                backgroundColor: colors.outlineVariant,
              },
            ]}
          />
        </View>
      ),
      [colors.outlineVariant],
    );

    // ── Background style ─────────────────────────────────────
    const backgroundStyle = useMemo(
      () => ({
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
      }),
      [colors.surface, radius.xl],
    );

    // ── Keyboard behavior ────────────────────────────────────
    const keyboardBehavior = Platform.OS === 'ios' ? 'interactive' as const : 'extend' as const;

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        handleComponent={renderHandle}
        backgroundStyle={backgroundStyle}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior="restore"
        enableDynamicSizing={false}
        enablePanDownToClose
      >
        {/* Optional Title */}
        {title && (
          <Text
            style={[
              typography.headlineMedium,
              {
                color: colors.onSurface,
                textAlign: 'center',
                paddingBottom: spacing.md,
                paddingHorizontal: spacing.lg,
              },
            ]}
          >
            {title}
          </Text>
        )}

        {/* Scrollable Content */}
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xxl,
          }}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

AppBottomSheet.displayName = 'AppBottomSheet';

// ============================================================
// STATIC STYLES
// ============================================================

const styles = StyleSheet.create({
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleIndicator: {
    // Dimensions set inline from theme
  },
});

export default AppBottomSheet;
