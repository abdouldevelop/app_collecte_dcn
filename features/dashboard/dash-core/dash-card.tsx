import React from 'react';
import { View, Text } from 'react-native';
import { AppCard } from '@/components/ui';
import { useAppTheme } from '@/theme';

type Props = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  action?: () => void;
  border: string;
};

const DashCard = ({ label, value, icon, border, action }: Props) => {
  const { colors, spacing, typography } = useAppTheme();

  return (
    <AppCard
      variant="elevated"
      animated={true}
      onPress={action}
      style={{ flex: 1 }}
      padding="lg"
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left side: label + value */}
        <View style={{ flex: 1, gap: spacing.sm }}>
          <Text
            style={[
              typography.bodySmall,
              { color: colors.onSurfaceVariant },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              typography.headlineMedium,
              { color: colors.onSurface, fontWeight: '700' },
            ]}
          >
            {value}
          </Text>
        </View>

        {/* Right side: icon in circle */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: `${border}15`,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {icon}
        </View>
      </View>
    </AppCard>
  );
};

export default DashCard;
