import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Souscription from '@/database/model/Souscription';
import Client from '@/database/model/Client';
import Kit from '@/database/model/Kit';
import Versement from '@/database/model/versement';
import { formatXOF } from '@/shared/utils';
import { database } from '@/database/database';
import { AppAvatar, AppBadge } from '@/components/ui';
import { useAppTheme } from '@/theme';

type Props = {
  subs: Souscription;
  client: Client;
  kit: Kit;
  payments: Versement[];
  clientSubscriptions: Souscription[];
};

const ClientKitItem = ({ client, kit, subs, payments, clientSubscriptions }: Props) => {
  const { colors, spacing, radius, typography } = useAppTheme();
  const router = useRouter();

  const totalPaid = payments?.reduce((sum, p) => sum + p.montant, 0) || 0;
  const total = kit.montantTotal || 1;
  const progress = Math.min((totalPaid / total) * 100, 100);
  const isCompleted = progress >= 100;
  const totalKits = clientSubscriptions?.length || 0;

  return (
    <Pressable
      onPress={() => router.push(`/(tabs)/clients/${client.id}`)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: pressed ? colors.surfaceVariant : colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
      })}
    >
      {/* Avatar */}
      <AppAvatar
        firstName={client.firstName || ''}
        lastName={client.lastName || ''}
        size="md"
      />

      {/* Info */}
      <View style={{ flex: 1, gap: spacing.xxs }}>
        {/* Name + kit count */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Text
            style={[typography.titleMedium, { color: colors.onSurface, flex: 1 }]}
            numberOfLines={1}
          >
            {client.firstName} {client.lastName}
          </Text>
          {totalKits > 1 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 3,
                backgroundColor: colors.primaryContainer,
                paddingHorizontal: spacing.xs,
                paddingVertical: 2,
                borderRadius: radius.sm,
              }}
            >
              <Feather name="package" size={10} color={colors.primary} />
              <Text style={[typography.caption, { color: colors.primary, fontWeight: '600' }]}>
                {totalKits}
              </Text>
            </View>
          )}
        </View>

        {/* Kit label + montant inline */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Text
            style={[typography.bodySmall, { color: colors.onSurfaceVariant, flex: 1 }]}
            numberOfLines={1}
          >
            {kit.label}
          </Text>
          <Text style={[typography.labelSmall, { color: colors.onSurfaceVariant }]}>
            {formatXOF(totalPaid)} / {formatXOF(total)}
          </Text>
        </View>

        {/* Mini progress bar */}
        <View
          style={{
            height: 4,
            backgroundColor: colors.surfaceContainerHigh,
            borderRadius: 2,
            marginTop: spacing.xxs,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: isCompleted ? colors.success : colors.primary,
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      {/* Badge + chevron */}
      <AppBadge
        label={isCompleted ? 'Fini' : `${Math.round(progress)}%`}
        variant="count"
        color={isCompleted ? 'success' : 'primary'}
        size="sm"
      />

      <Feather name="chevron-right" size={18} color={colors.outlineVariant} />
    </Pressable>
  );
};

const enhance = withObservables(
  ['subs'],
  ({ subs }: { subs: Souscription }) => ({
    subs: subs ? subs.observe() : null,
    client: subs ? subs.client.observe() : null,
    kit: subs ? subs.kit.observe() : null,
    payments: database.collections
      .get<Versement>('versements')
      .query(
        Q.where('souscription_id', subs.id),
        Q.sortBy('created_at', Q.desc)
      )
      .observe(),
    clientSubscriptions: database.collections
      .get<Souscription>('souscriptions')
      .query(Q.where('client_id', subs.clientId))
      .observe(),
  })
);

const EnhancedClientKitItem = enhance(ClientKitItem);
export default EnhancedClientKitItem;
