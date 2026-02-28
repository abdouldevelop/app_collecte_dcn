import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { s } from 'react-native-size-matters';
import { useAppTheme } from '@/theme';

// ============================================================
// AppEmptyState - Ecran vide avec icone, titre et description
// Utilise pour les listes vides, etats d'erreur, etc.
// ============================================================

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

export interface AppEmptyStateProps {
  /** Feather icon name displayed in the circle */
  icon: FeatherIconName;
  /** Main title text */
  title: string;
  /** Descriptive text below the title */
  description: string;
  /** Optional action button label */
  actionLabel?: string;
  /** Optional action button press handler */
  onAction?: () => void;
}

const ICON_CIRCLE_SIZE = s(80);
const ICON_SIZE = s(32);

export function AppEmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: AppEmptyStateProps) {
  const { colors, spacing, typography } = useAppTheme();

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(18)}
      style={[styles.container, { padding: spacing.xl }]}
    >
      {/* Icon Circle */}
      <View
        style={[
          styles.iconCircle,
          {
            width: ICON_CIRCLE_SIZE,
            height: ICON_CIRCLE_SIZE,
            borderRadius: ICON_CIRCLE_SIZE / 2,
            backgroundColor: colors.primaryContainer,
          },
        ]}
      >
        <Feather name={icon} size={ICON_SIZE} color={colors.primary} />
      </View>

      {/* Title */}
      <Text
        style={[
          typography.headlineMedium,
          {
            color: colors.onSurface,
            marginTop: spacing.lg,
            textAlign: 'center',
          },
        ]}
      >
        {title}
      </Text>

      {/* Description */}
      <Text
        style={[
          typography.bodyMedium,
          {
            color: colors.onSurfaceVariant,
            textAlign: 'center',
            marginTop: spacing.sm,
          },
        ]}
      >
        {description}
      </Text>

      {/* Optional Action Button */}
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            styles.actionButton,
            { marginTop: spacing.xl, opacity: pressed ? 0.7 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text
            style={[
              typography.labelLarge,
              { color: colors.primary },
            ]}
          >
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

// ============================================================
// STATIC STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default AppEmptyState;
