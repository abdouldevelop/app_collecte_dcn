import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme';

// ============================================================
// AppDivider - Separateur horizontal ou vertical
// Supporte un label optionnel centre (style "line - text - line")
// ============================================================

export interface AppDividerProps {
  /** Optional label text displayed centered between the lines */
  label?: string;
  /** Divider orientation (default 'horizontal') */
  orientation?: 'horizontal' | 'vertical';
  /** Spacing around the divider using a number value (default uses spacing.sm) */
  spacing?: number;
}

export function AppDivider({
  label,
  orientation = 'horizontal',
  spacing: spacingProp,
}: AppDividerProps) {
  const { colors, spacing, typography } = useAppTheme();

  const dividerSpacing = spacingProp ?? spacing.sm;

  // ── Vertical divider ───────────────────────────────────────
  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.verticalLine,
          {
            backgroundColor: colors.outlineVariant,
            marginHorizontal: dividerSpacing,
          },
        ]}
      />
    );
  }

  // ── Horizontal divider with label ──────────────────────────
  if (label) {
    return (
      <View
        style={[
          styles.labelContainer,
          { marginVertical: dividerSpacing },
        ]}
      >
        <View
          style={[
            styles.horizontalLine,
            { backgroundColor: colors.outlineVariant },
          ]}
        />
        <Text
          style={[
            typography.labelSmall,
            {
              color: colors.onSurfaceVariant,
              paddingHorizontal: spacing.sm,
            },
          ]}
        >
          {label}
        </Text>
        <View
          style={[
            styles.horizontalLine,
            { backgroundColor: colors.outlineVariant },
          ]}
        />
      </View>
    );
  }

  // ── Horizontal divider (plain) ─────────────────────────────
  return (
    <View
      style={[
        styles.plainLine,
        {
          backgroundColor: colors.outlineVariant,
          marginVertical: dividerSpacing,
        },
      ]}
    />
  );
}

// ============================================================
// STATIC STYLES
// ============================================================

const styles = StyleSheet.create({
  plainLine: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  verticalLine: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
});

export default AppDivider;
