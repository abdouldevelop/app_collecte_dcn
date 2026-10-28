import { Pressable, View, Text } from 'react-native';
import React from 'react';
import { formatPhoneNumber } from '@/shared/utils';
import { withObservables } from '@nozbe/watermelondb/react';
import Client from '@/database/model/Client';
import Souscription from '@/database/model/Souscription';
import { useRouter } from 'expo-router';
import { AppAvatar, AppBadge } from '@/components/ui';
import { useAppTheme } from '@/theme';

type Props = {
  client: Client;
  souscriptions?: Souscription[];
};

const ClientItem = ({ client, souscriptions }: Props) => {
  const { colors, spacing, typography, radius } = useAppTheme();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/(tabs)/clients/${client.id}`)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.sm,
      }}
    >
      <AppAvatar firstName={client.firstName || ''} lastName={client.lastName || ''} size="md" />

      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text numberOfLines={1} style={[typography.titleMedium, { color: colors.onSurface }]}>
          {client.firstName} {client.lastName}
        </Text>
        <Text style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}>
          {formatPhoneNumber(client.phone)}
        </Text>
      </View>

      {souscriptions && souscriptions.length > 0 && (
        <AppBadge label={souscriptions.length} variant="count" color="primary" size="sm" />
      )}
    </Pressable>
  );
};

const enhance = withObservables(['client'], ({ client }: { client: Client }) => ({
  client: client.observe(),
  souscriptions: client.souscriptions.observe(),
}));

const EnhancedClientItem = enhance(ClientItem);

export default EnhancedClientItem;
