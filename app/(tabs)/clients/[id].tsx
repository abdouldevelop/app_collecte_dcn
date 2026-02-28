import {
  ScrollView,
  Text,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/theme';
import { AppAvatar } from '@/components/ui';
import SubscriptionNew from '@/features/subscription/subscription-new';
import { useClients } from '@/hooks/app/useClient';
import { database } from '@/database/database';
import Client from '@/database/model/Client';
import EnhancedSubscriptionList from '@/features/subscription/subscription-list';

// ============================================================
// CONSTANTS
// ============================================================

const SEGMENTS = ['Souscriptions', 'Nouveau'] as const;

// ============================================================
// SEGMENTED CONTROL
// ============================================================

type SegmentedControlProps = {
  activeIndex: number;
  onPress: (index: number) => void;
};

function SegmentedControl({ activeIndex, onPress }: SegmentedControlProps) {
  const { colors, spacing, radius, elevation, typography } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surfaceVariant,
        borderRadius: radius.md,
        padding: spacing.xxs,
        gap: 2,
      }}
    >
      {SEGMENTS.map((label, index) => {
        const isActive = activeIndex === index;

        return (
          <Pressable
            key={label}
            onPress={() => onPress(index)}
            style={[
              {
                flex: 1,
                paddingVertical: spacing.sm + spacing.xxs,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.md - 2,
                backgroundColor: isActive ? colors.surface : 'transparent',
                ...(isActive ? elevation.sm : {}),
              },
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                typography.labelLarge,
                {
                  color: isActive ? colors.primary : colors.onSurfaceVariant,
                },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ============================================================
// PAGE COMPONENT
// ============================================================

const Page = () => {
  const { colors, spacing, radius, typography } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // --- State ---
  const [isChanging, setIsChanging] = useState(false);
  const [activeSegment, setActiveSegment] = useState(0);

  const { getClientById } = useClients(database);
  const [client, setClient] = useState<Client | null>(null);

  // --- Fetch client ---
  useEffect(() => {
    if (id) {
      getClientById(id).then((result) => {
        if (result) setClient(result);
      });
    }
  }, [id, getClientById]);

  // --- Segment toggle ---
  const handleSegmentChange = useCallback((index: number) => {
    setActiveSegment(index);
    setIsChanging(index === 1);
  }, []);

  // --- Navigate back ---
  const handleBack = useCallback(() => {
    router.replace('/(tabs)/clients');
  }, [router]);

  // --- Derived values ---
  const clientFirstName = client?.firstName || '';
  const clientLastName = client?.lastName || '';
  const clientFullName =
    clientFirstName && clientLastName
      ? `${clientFirstName} ${clientLastName}`
      : clientFirstName || clientLastName || 'Client';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* ── FIXED HEADER ──────────────────────────────────── */}
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingBottom: spacing.md,
            backgroundColor: colors.background,
          }}
        >
          {/* Back button + client info row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              paddingTop: spacing.sm,
            }}
          >
            <Pressable
              onPress={handleBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: radius.md,
                backgroundColor: colors.surfaceVariant,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
              accessibilityRole="button"
              accessibilityLabel="Retour"
            >
              <Feather name="arrow-left" size={20} color={colors.onSurface} />
            </Pressable>

            {/* Avatar + Name inline */}
            {client && (
              <Animated.View
                entering={FadeInDown.springify().damping(18)}
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.md }}
              >
                <AppAvatar
                  firstName={clientFirstName}
                  lastName={clientLastName}
                  size="md"
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[typography.titleMedium, { color: colors.onSurface }]}
                    numberOfLines={1}
                  >
                    {clientFullName}
                  </Text>
                  {client?.phone ? (
                    <Text
                      style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
                    >
                      {client.phone}
                    </Text>
                  ) : null}
                </View>
              </Animated.View>
            )}
          </View>

          {/* Segmented Control */}
          <View style={{ marginTop: spacing.md }}>
            <SegmentedControl
              activeIndex={activeSegment}
              onPress={handleSegmentChange}
            />
          </View>
        </View>

        {/* ── SCROLLABLE CONTENT ────────────────────────────── */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            contentContainerStyle={{
              paddingBottom: 70 + insets.bottom + spacing.xl,
            }}
          >
            {id && !isChanging ? (
              <EnhancedSubscriptionList clientId={id} />
            ) : (
              <SubscriptionNew id={id} />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Page;
