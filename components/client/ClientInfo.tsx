import React from 'react';
import { View, Text, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { formatPhoneNumber } from '@/shared/utils';
import Client from '@/database/model/Client';
import { AppAvatar, AppButton, AppBadge } from '@/components/ui';
import { useAppTheme } from '@/theme';

interface ClientInfoProps {
  client: Client | null;
  photo?: string;
  onEditProfile?: () => void;
  onSettings?: () => void;
  containerStyle?: ViewStyle;
  headerStop?: boolean;
  handleSwitch?: () => void;
  handleBack?: () => void;
}

const ClientInfo: React.FC<ClientInfoProps> = ({
  client,
  containerStyle,
  handleSwitch,
  handleBack,
}) => {
  const { colors, spacing, typography, radius, elevation } = useAppTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          overflow: 'hidden',
          ...elevation.md,
        },
        containerStyle,
      ]}
    >
      <LinearGradient
        colors={colors.gradient.primary as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.xxl,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.lg,
        }}
      >
        <AppAvatar
          firstName={client?.firstName || ''}
          lastName={client?.lastName || ''}
          size="xl"
          backgroundColor="rgba(255,255,255,0.2)"
        />

        <View style={{ flex: 1 }}>
          <Text style={[typography.headlineMedium, { color: '#FFFFFF', marginBottom: spacing.xs }]}>
            {client?.firstName} {client?.lastName}
          </Text>
          <Text style={[typography.bodyMedium, { color: 'rgba(255,255,255,0.8)' }]}>
            {formatPhoneNumber(client?.phone || '')}
          </Text>
        </View>
      </LinearGradient>

      <View
        style={{
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          onPress={() => handleBack?.()}
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.full,
            backgroundColor: colors.surfaceVariant,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
        </Pressable>

        <AppBadge label="Active" variant="status" color="success" />

        <AppButton
          label="Kits"
          variant="filled"
          size="sm"
          gradient
          leftIcon="plus"
          onPress={() => handleSwitch?.()}
        />
      </View>
    </View>
  );
};

export default ClientInfo;
