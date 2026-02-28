import { ScrollView, Text, View, Pressable } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Animated, {
  FadeIn,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';

import { useAppTheme } from '@/theme';
import { AppSearchBar, AppBadge, AppEmptyState, AppBottomSheet } from '@/components/ui';
import { database } from '@/database/database';
import Client from '@/database/model/Client';
import Kit from '@/database/model/Kit';
import Souscription from '@/database/model/Souscription';
import EnhancedClientKitItem from '@/features/dashboard/client/clients-kit-item';
import AddClient from '@/features/dashboard/client/add-client';

// ============================================================
// TYPES
// ============================================================

type Props = {
  clients?: Client[];
  subscriptions?: Souscription[];
  kits?: Kit[];
};

// ============================================================
// KIT CHIP
// ============================================================

type KitChipProps = {
  kit: Kit;
  isSelected: boolean;
  count: number;
  onPress: () => void;
};

function KitChip({ kit, isSelected, count, onPress }: KitChipProps) {
  const { colors, spacing, radius, typography } = useAppTheme();

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radius.full,
          borderWidth: 1,
          borderColor: isSelected ? colors.primary : colors.outlineVariant,
          backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
        }}
      >
        <Text
          style={[
            typography.labelMedium,
            {
              color: isSelected ? colors.onPrimaryContainer : colors.onSurfaceVariant,
            },
          ]}
          numberOfLines={1}
        >
          {kit.label}
        </Text>
        <AppBadge
          label={count}
          variant="count"
          color={isSelected ? 'primary' : 'neutral'}
          size="sm"
        />
      </View>
    </Pressable>
  );
}

// ============================================================
// PAGE COMPONENT
// ============================================================

const Page = ({ clients, subscriptions, kits }: Props) => {
  const { colors, spacing, radius, elevation, typography } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKitId, setSelectedKitId] = useState<string | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // --- Filter clients based on search query → get matching IDs ---
  const matchingClientIds = searchQuery.trim()
    ? new Set(
        clients
          ?.filter(
            (client) =>
              client.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              client.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              client.phone?.includes(searchQuery),
          )
          .map((c) => c.id),
      )
    : null;

  // --- Filter subscriptions based on selected kit + search query ---
  const filteredSubscriptions = subscriptions?.filter((sub) => {
    const matchesKit = selectedKitId ? sub.kitId === selectedKitId : true;
    const matchesSearch = matchingClientIds ? matchingClientIds.has(sub.clientId) : true;
    return matchesKit && matchesSearch;
  });

  // --- Get subscription count per kit ---
  const getKitSubscriptionCount = useCallback(
    (kitId: string) => {
      return subscriptions?.filter((sub) => sub.kitId === kitId).length || 0;
    },
    [subscriptions],
  );

  // --- Toggle kit filter ---
  const handleKitPress = useCallback(
    (kitId: string) => {
      setSelectedKitId((current) => (current === kitId ? null : kitId));
    },
    [],
  );

  // --- Open add client bottom sheet ---
  const handleOpenAddClient = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // --- Close add client bottom sheet ---
  const handleCloseAddClient = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* ── Title ─────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm }}>
          <Text style={[typography.headlineLarge, { color: colors.onSurface }]}>
            Clients
          </Text>
          <Text style={[typography.bodySmall, { color: colors.onSurfaceVariant, marginTop: spacing.xxs }]}>
            {subscriptions?.length || 0} souscription{(subscriptions?.length || 0) > 1 ? 's' : ''}
          </Text>
        </View>

        {/* ── Search ────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing.sm }}>
          <AppSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher un client..."
          />
        </View>

        {/* ── Kit Filter Chips (fixed, not scrolling vertically) ── */}
        <View style={{ marginBottom: spacing.sm }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.xl }}
          >
            {/* "Tous" chip */}
            <Pressable onPress={() => setSelectedKitId(null)}>
              <View
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: radius.full,
                  borderWidth: 1,
                  borderColor: !selectedKitId ? colors.primary : colors.outlineVariant,
                  backgroundColor: !selectedKitId ? colors.primaryContainer : colors.surface,
                }}
              >
                <Text
                  style={[
                    typography.labelMedium,
                    { color: !selectedKitId ? colors.onPrimaryContainer : colors.onSurfaceVariant },
                  ]}
                >
                  Tous ({subscriptions?.length || 0})
                </Text>
              </View>
            </Pressable>

            {kits?.map((kit) => (
              <KitChip
                key={kit.id}
                kit={kit}
                isSelected={selectedKitId === kit.id}
                count={getKitSubscriptionCount(kit.id)}
                onPress={() => handleKitPress(kit.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Client List ──────────────────────────────────── */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            gap: spacing.sm,
            paddingHorizontal: spacing.xl,
            paddingBottom: 70 + insets.bottom + spacing.xl,
          }}
        >
          {filteredSubscriptions?.map((item, index) => (
            <Animated.View
              key={item?.id}
              entering={FadeInRight.delay(Math.min(index, 10) * 40)
                .springify()
                .damping(18)}
            >
              <EnhancedClientKitItem subs={item} />
            </Animated.View>
          ))}

          {/* Empty State: search with no results */}
          {filteredSubscriptions?.length === 0 && searchQuery.trim() && (
            <AppEmptyState
              icon="search"
              title="Aucun resultat"
              description={`Aucun client trouve pour "${searchQuery}".`}
            />
          )}

          {/* Empty State: filter active, no results */}
          {filteredSubscriptions?.length === 0 && selectedKitId && !searchQuery.trim() && (
            <AppEmptyState
              icon="package"
              title="Aucune souscription"
              description="Aucune souscription trouvee pour ce kit."
            />
          )}

          {/* Empty State: no subscriptions at all */}
          {subscriptions?.length === 0 && !selectedKitId && !searchQuery.trim() && (
            <AppEmptyState
              icon="users"
              title="Aucun client"
              description="Ajoutez votre premier client."
              actionLabel="Ajouter un client"
              onAction={handleOpenAddClient}
            />
          )}
        </ScrollView>
      </SafeAreaView>

      {/* ── FAB ──────────────────────────────────────────────── */}
      <Animated.View
        entering={FadeIn.springify().damping(14)}
        style={{
          position: 'absolute',
          bottom: 70 + insets.bottom + spacing.lg,
          right: spacing.xl,
        }}
      >
        <Pressable
          onPress={handleOpenAddClient}
          style={({ pressed }) => [
            {
              width: 56,
              height: 56,
              borderRadius: radius.full,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              ...elevation.lg,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Ajouter un client"
        >
          <Feather name="plus" size={24} color={colors.onPrimary} />
        </Pressable>
      </Animated.View>

      {/* ── Bottom Sheet: Add Client ──────────────────────── */}
      <AppBottomSheet
        ref={bottomSheetModalRef}
        snapPoints={['90%']}
        title="Nouveau client"
        onDismiss={() => {}}
      >
        <AddClient closeModal={handleCloseAddClient} />
      </AppBottomSheet>
    </View>
  );
};

// ============================================================
// WATERMELONDB OBSERVABLES
// ============================================================

const enhance = withObservables([], () => ({
  clients: database
    .get<Client>('clients')
    .query(Q.sortBy('created_at', Q.desc))
    .observeWithColumns(['first_name', 'last_name', 'phone']),

  subscriptions: database.collections
    .get<Souscription>('souscriptions')
    .query(Q.sortBy('created_at', Q.desc))
    .observeWithColumns(['kit_id', 'client_id', 'statut']),

  kits: database.collections
    .get<Kit>('kits')
    .query(Q.sortBy('label', Q.asc))
    .observeWithColumns(['label']),
}));

const EnhancedPage = enhance(Page);

export default EnhancedPage;
