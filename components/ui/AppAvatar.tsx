import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useAppTheme } from '@/theme';

// ============================================================
// AppAvatar - Composant avatar avec initiales
// Genere une couleur coherente a partir du nom
// ============================================================

const AVATAR_PALETTE = [
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Rose
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
] as const;

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AppAvatarProps {
  /** First name used to generate initials */
  firstName: string;
  /** Last name used to generate initials */
  lastName: string;
  /** Avatar size preset */
  size?: AvatarSize;
  /** Override the generated background color */
  backgroundColor?: string;
  /** Additional styles applied to the container */
  style?: StyleProp<ViewStyle>;
}

/**
 * Generates a deterministic hash from a string.
 * Used to consistently assign a color from the palette based on the name.
 */
function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Returns a consistent color from the palette based on the full name.
 */
function getColorFromName(firstName: string, lastName: string): string {
  const fullName = `${firstName}${lastName}`.toLowerCase();
  const index = hashName(fullName) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

/**
 * Extracts initials from first and last name (uppercase, max 2 chars).
 */
function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0).toUpperCase();
  const last = lastName.trim().charAt(0).toUpperCase();
  return `${first}${last}`;
}

export function AppAvatar({
  firstName,
  lastName,
  size = 'md',
  backgroundColor,
  style,
}: AppAvatarProps) {
  const { avatarSize, radius } = useAppTheme();

  const dimension = avatarSize[size];
  const initials = useMemo(() => getInitials(firstName, lastName), [firstName, lastName]);
  const bgColor = useMemo(
    () => backgroundColor ?? getColorFromName(firstName, lastName),
    [backgroundColor, firstName, lastName],
  );
  const fontSize = dimension * 0.38;

  return (
    <View
      style={[
        {
          width: dimension,
          height: dimension,
          borderRadius: radius.full,
          backgroundColor: bgColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text
        style={{
          color: '#FFFFFF',
          fontSize,
          fontWeight: '700',
          includeFontPadding: false,
          textAlignVertical: 'center',
        }}
        allowFontScaling={false}
      >
        {initials}
      </Text>
    </View>
  );
}

export default AppAvatar;
