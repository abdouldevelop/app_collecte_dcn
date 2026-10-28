import React from 'react';
import { View, Text } from 'react-native';
import { database } from '@/database/database';
import Client from '@/database/model/Client';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { formatPhoneNumber } from '@/shared/utils';
import { AppAvatar } from '@/components/ui';
import { useAppTheme } from '@/theme';
import { Feather } from '@expo/vector-icons';

type Props = {
  clients?: Client[];
};

const LastedClients = ({ clients }: Props) => {
  const { colors, spacing, typography, radius } = useAppTheme();

  return (
    <View style={{ flex: 1, gap: spacing.xs }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        <Feather name="users" size={14} color={colors.primary} />
        <Text style={[typography.labelMedium, { color: colors.onSurfaceVariant }]}>
          Derniers clients
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          justifyContent: clients && clients.length > 0 ? 'center' : 'center',
          overflow: 'hidden',
        }}
      >
        {clients && clients.length > 0 ? (
          clients.map((item, index) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.md,
                borderTopWidth: index > 0 ? 1 : 0,
                borderTopColor: colors.outlineVariant,
              }}
            >
              <AppAvatar
                firstName={item.firstName || ''}
                lastName={item.lastName || ''}
                size="sm"
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[typography.bodySmall, { color: colors.onSurface }]}
                  numberOfLines={1}
                >
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={[typography.caption, { color: colors.onSurfaceVariant }]}>
                  {formatPhoneNumber(item.phone)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={[typography.bodySmall, { color: colors.onSurfaceVariant, textAlign: 'center', padding: spacing.md }]}>
            Aucun client
          </Text>
        )}
      </View>
    </View>
  );
};

const enhance = withObservables([], () => ({
  clients: database
    .get<Client>('clients')
    .query(Q.sortBy('created_at', Q.desc), Q.take(3))
    .observeWithColumns(['first_name', 'last_name', 'phone', 'updated_at']),
}));

const EnhancedLastedClients = enhance(LastedClients);
export default EnhancedLastedClients;
