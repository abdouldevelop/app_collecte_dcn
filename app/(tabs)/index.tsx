import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { withObservables } from '@nozbe/watermelondb/react';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAppTheme } from '@/theme';
import { database } from '@/database/database';
import { formatXOF } from '@/shared/utils';
import { agentStore } from '@/storage/MMKV';
import { useSyncStore } from '@/storage/syncStore';
import { syncWithBackend, logoutAndWipe } from '@/database/db_utils';

import EnhancedLastedClients from '@/features/dashboard/dash-core/new-client';
import EnhancedLastedPayments from '@/features/dashboard/dash-core/recent-payment';
import QRScannerCompo from '@/features/scanner';
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

  const [balanceHidden, setBalanceHidden] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const totalAmount = versements?.reduce((acc, cur) => acc + cur.montant, 0) || 0;
  const activeSaison = saisons?.find((s) => s.active) || saisons?.[0];

  const { agent } = agentStore();

  const handleLogout = async () => {
    Haptics.selectionAsync();
    Alert.alert(
      'Changer de compte',
      'Les données de ce compte seront effacées de cet appareil. Voulez-vous continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            const res = await logoutAndWipe();
            if (res.blocked) {
              Alert.alert(
                'Synchronisation requise',
                `${res.pendingCount ?? ''} donnée(s) ne sont pas encore synchronisée(s). Connectez-vous à Internet et synchronisez avant de changer de compte, pour ne rien perdre.`
              );
            } else if (!res.success) {
              Alert.alert('Erreur', res.error ?? 'Impossible de se déconnecter.');
            }
            // En cas de succès : hasAccount passe à false → redirection auto vers le login
          },
        },
      ]
    );
  };

  const agentFullName =
    [agent?.agent?.firstName, agent?.agent?.lastName].filter(Boolean).join(' ');

  const handleSync = async () => {
    Haptics.selectionAsync();
    const sync = useSyncStore.getState();
    sync.start('Synchronisation…');
    const res = await syncWithBackend();
    if (res.success) {
      sync.succeed(`${res.pullCount || 0} reçu(s), ${res.pushCount || 0} envoyé(s)`);
    } else {
      sync.fail('Synchronisation différée');
    }
  };

  const go = (path: string) => {
    Haptics.selectionAsync();
    router.push(path as any);
  };

  const openScanner = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScannerOpen(true);
  };

  // ── Actions rapides (grille à icônes colorées, façon mobile-money) ──
  const actions: {
    label: string;
    icon: keyof typeof Feather.glyphMap;
    color: string;
    bg: string;
    onPress: () => void;
  }[] = [
    {
      label: 'Clients',
      icon: 'users',
      color: colors.accent.blue,
      bg: colors.accent.blueBg,
      onPress: () => go('/(tabs)/clients'),
    },
    {
      label: 'Versements',
      icon: 'credit-card',
      color: colors.accent.green,
      bg: colors.accent.greenBg,
      onPress: () => go('/(tabs)/payment'),
    },
    {
      label: 'Souscriptions',
      icon: 'layers',
      color: colors.tertiary,
      bg: colors.tertiaryContainer,
      onPress: () => go('/(tabs)/clients'),
    },
    {
      label: 'Synchroniser',
      icon: 'refresh-cw',
      color: colors.accent.orange,
      bg: colors.accent.orangeBg,
      onPress: handleSync,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />

      {/* ══════════════ HÉRO (dégradé violet) ══════════════ */}
      <LinearGradient
        colors={[colors.gradient.primary[0], colors.gradient.primary[1]] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xl }}>
            {/* Barre du haut : salutation + déconnexion */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: spacing.sm,
              }}
            >
              <View style={{ flex: 1, gap: spacing.xxs }}>
                <Text
                  style={[typography.bodySmall, { color: 'rgba(255,255,255,0.85)' }]}
                >
                  Bonjour,
                </Text>
                <Text
                  style={[typography.titleLarge, { color: '#FFFFFF' }]}
                  numberOfLines={1}
                >
                  {agentFullName || 'Agent'}
                </Text>
              </View>

              <Pressable
                onPress={handleLogout}
                hitSlop={12}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.full,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="log-out" size={18} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Solde héro : total collecté + œil pour masquer */}
            <View style={{ alignItems: 'center', marginTop: spacing.lg, gap: spacing.xs }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <Text style={[typography.labelMedium, { color: 'rgba(255,255,255,0.85)' }]}>
                  Total collecté
                </Text>
                {activeSaison ? (
                  <View
                    style={{
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 2,
                      borderRadius: radius.full,
                      backgroundColor: 'rgba(255,255,255,0.18)',
                    }}
                  >
                    <Text style={[typography.caption, { color: '#FFFFFF' }]}>
                      {activeSaison.label}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Text style={[typography.displayLarge, { color: '#FFFFFF' }]}>
                  {balanceHidden ? '••••••' : formatXOF(totalAmount)}
                </Text>
                <Pressable
                  onPress={() => setBalanceHidden((v) => !v)}
                  hitSlop={12}
                >
                  <Feather
                    name={balanceHidden ? 'eye-off' : 'eye'}
                    size={20}
                    color="rgba(255,255,255,0.9)"
                  />
                </Pressable>
              </View>
            </View>

            {/* Carte Scanner (pièce maîtresse, façon carte QR) */}
            <Animated.View entering={FadeInDown.delay(60).springify().damping(15)}>
            <Pressable
              onPress={openScanner}
              style={({ pressed }) => ({
                marginTop: spacing.xl,
                backgroundColor: '#FFFFFF',
                borderRadius: radius.xl,
                padding: spacing.lg,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                opacity: pressed ? 0.9 : 1,
                ...elevation.lg,
              })}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: radius.lg,
                  backgroundColor: colors.primaryContainer,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="qr-code" size={28} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
                  Scanner une carte
                </Text>
                <Text style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}>
                  Encaissez un versement en un scan
                </Text>
              </View>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.full,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="camera" size={18} color="#FFFFFF" />
              </View>
            </Pressable>
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ══════════════ FEUILLE BLANCHE ══════════════ */}
      <View
        style={{
          flex: 1,
          marginTop: -spacing.lg,
          backgroundColor: colors.background,
          borderTopLeftRadius: radius.xxl,
          borderTopRightRadius: radius.xxl,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
            paddingBottom: 80 + spacing.xl,
            gap: spacing.lg,
          }}
        >
          {/* Actions rapides */}
          <Animated.View
            entering={FadeInDown.delay(120).springify().damping(16)}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {actions.map((a) => (
              <Pressable
                key={a.label}
                onPress={a.onPress}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  gap: spacing.xs,
                  width: '23%',
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: radius.full,
                    backgroundColor: a.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name={a.icon} size={22} color={a.color} />
                </View>
                <Text
                  style={[typography.labelSmall, { color: colors.onSurfaceVariant }]}
                  numberOfLines={1}
                >
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </Animated.View>

          {/* Bandeau statistiques */}
          <Animated.View
            entering={FadeInDown.delay(200).springify().damping(16)}
            style={{
              flexDirection: 'row',
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              paddingVertical: spacing.md,
              ...elevation.sm,
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
            <View style={{ width: 1, backgroundColor: colors.outlineVariant }} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={[typography.titleLarge, { color: colors.success }]}>
                {kits?.length || 0}
              </Text>
              <Text style={[typography.caption, { color: colors.onSurfaceVariant }]}>
                Kits
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: colors.outlineVariant }} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={[typography.titleLarge, { color: colors.warning }]}>
                {versements?.length || 0}
              </Text>
              <Text style={[typography.caption, { color: colors.onSurfaceVariant }]}>
                Versements
              </Text>
            </View>
          </Animated.View>

          {/* Activité récente */}
          <Animated.View
            entering={FadeInDown.delay(280).springify().damping(16)}
            style={{ gap: spacing.md, minHeight: 200 }}
          >
            <EnhancedLastedClients />
            <EnhancedLastedPayments />
          </Animated.View>
        </ScrollView>
      </View>

      {/* ══════════════ SCANNER (plein écran) ══════════════ */}
      <Modal
        visible={scannerOpen}
        animationType="slide"
        onRequestClose={() => setScannerOpen(false)}
        statusBarTranslucent
      >
        <QRScannerCompo handleClose={() => setScannerOpen(false)} />
      </Modal>
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
