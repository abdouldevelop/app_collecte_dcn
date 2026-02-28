import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withObservables } from '@nozbe/watermelondb/react';

import { useAppTheme } from '@/theme';
import { AppBadge } from '@/components/ui';
import { database } from '@/database/database';
import { formatXOF } from '@/shared/utils';
import { agentStore } from '@/storage/MMKV';
import { syncWithBackend } from '@/database/db_utils';

import EnhancedLastedClients from '@/features/dashboard/dash-core/new-client';
import EnhancedLastedPayments from '@/features/dashboard/dash-core/recent-payment';
import SyncButton from '@/components/SyncButton';
import Versement from '@/database/model/versement';
import Souscription from '@/database/model/Souscription';
import Kit from '@/database/model/Kit';
import Saison from '@/database/model/Saison';

type Props = {
  versements?: Versement[];
  souscriptions?: Souscription[];
  kits?: Kit[];
  saisons?: Saison[];
};

const Page = ({ versements, souscriptions, kits, saisons }: Props) => {
  const { colors, spacing, typography, radius, elevation } = useAppTheme();

  const totalAmount = versements?.reduce((acc, cur) => acc + cur.montant, 0);
  const activeSaison = saisons?.find((s) => s.active) || saisons?.[0];

  const { logout, agent } = agentStore();

  const agentFirstName =
    agent?.data?.agent?.firstName || agent?.agent?.firstName || '';

  useEffect(() => {
    syncWithBackend();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* ── HEADER ──────────────────────────────────────── */}
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.md,
            paddingBottom: spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Text
                style={[typography.headlineLarge, { color: colors.onSurface }]}
                numberOfLines={1}
              >
                Bonjour, {agentFirstName}
              </Text>
              {activeSaison && (
                <AppBadge
                  label={activeSaison.label || 'Aucune saison'}
                  variant="label"
                  color="primary"
                  size="sm"
                />
              )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <SyncButton />
              <Pressable
                onPress={logout}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={{ padding: spacing.sm }}
              >
                <Feather name="log-out" size={22} color={colors.error} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* ── CONTENT (fills space between header and tab bar) ── */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing.xl,
            paddingBottom: 70 + spacing.xl,
            gap: spacing.md,
          }}
        >
          {/* ── Summary Card ── */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              ...elevation.sm,
              overflow: 'hidden',
            }}
          >
            {/* Main stat */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                padding: spacing.md,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.md,
                  backgroundColor: colors.primaryContainer,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="wallet" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.caption, { color: colors.onSurfaceVariant }]}>
                  Versements du jour
                </Text>
                <Text style={[typography.headlineMedium, { color: colors.onSurface }]}>
                  {formatXOF(totalAmount || 0)}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: colors.outlineVariant, marginHorizontal: spacing.md }} />

            {/* Stats row */}
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
              }}
            >
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[typography.titleLarge, { color: colors.primary }]}>
                  {souscriptions?.length || 0}
                </Text>
                <Text style={[typography.caption, { color: colors.onSurfaceVariant }]}>
                  Souscriptions
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.outlineVariant, marginVertical: spacing.xxs }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[typography.titleLarge, { color: colors.success }]}>
                  {kits?.length || 0}
                </Text>
                <Text style={[typography.caption, { color: colors.onSurfaceVariant }]}>
                  Kits
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.outlineVariant, marginVertical: spacing.xxs }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[typography.titleLarge, { color: colors.warning }]}>
                  {versements?.length || 0}
                </Text>
                <Text style={[typography.caption, { color: colors.onSurfaceVariant }]}>
                  Versements
                </Text>
              </View>
            </View>
          </View>

          {/* ── Recent activity (fills remaining space) ── */}
          <View style={{ flex: 1, gap: spacing.md }}>
            <EnhancedLastedClients />
            <EnhancedLastedPayments />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const enhance = withObservables([], () => ({
  versements: database
    .get<Versement>('versements')
    .query()
    .observeWithColumns(['amount']),
  souscriptions: database
    .get<Souscription>('souscriptions')
    .query()
    .observeWithColumns(['kit_id']),
  kits: database.get<Kit>('kits').query().observeWithColumns(['label']),
  saisons: database.get<Saison>('saisons').query().observe(),
}));

const EnhancedPage = enhance(Page);

export default EnhancedPage;
