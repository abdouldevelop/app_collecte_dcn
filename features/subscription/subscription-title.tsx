import { View, Text } from 'react-native';
import React from 'react';
import { useAppTheme } from '@/theme';

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const SubscriptionTitle = ({ icon, title, description }: Props) => {
  const { colors, spacing, typography } = useAppTheme();

  return (
    <View style={{ marginTop: spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        {icon}
        <Text style={[typography.headlineMedium, { color: colors.onSurface, marginLeft: spacing.md }]}>
          {title}
        </Text>
      </View>
      <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant, marginBottom: spacing.lg, marginLeft: spacing.xxxl }]}>
        {description}
      </Text>
    </View>
  );
};

export default SubscriptionTitle;
