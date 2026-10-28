import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

import { useAppTheme } from '@/theme';
import { AppInput, AppButton } from '@/components/ui';
import { agentStore } from '@/storage/MMKV';
import { logoutAndWipe } from '@/database/db_utils';
import { hashSecret } from '@/shared/crypto';
import { formatPhoneNumber } from '@/shared/utils';

const Page = () => {
  const { colors, spacing, typography, radius, elevation } = useAppTheme();
  const insets = useSafeAreaInsets();

  const { agent, passwordHash, unlock } = agentStore();

  const handleSwitchAccount = () => {
    Alert.alert(
      'Changer de compte',
      'Les données de ce compte seront effacées de cet appareil. Voulez-vous continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Changer de compte',
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
          },
        },
      ]
    );
  };

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const firstName = agent?.agent?.firstName || '';
  const lastName = agent?.agent?.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Agent';
  const phone = agent?.agent?.phone || '';
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'A';

  async function onUnlock() {
    Keyboard.dismiss();
    setError(null);
    if (password.length < 4) {
      setError('Saisissez votre mot de passe');
      return;
    }
    setIsLoading(true);
    try {
      const hash = await hashSecret(password);
      if (hash === passwordHash) {
        unlock();
      } else {
        setError('Mot de passe incorrect');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* ── HERO ─────────────────────────────────────────── */}
          <LinearGradient
            colors={[colors.gradient.primary[0], colors.gradient.primary[1]] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingTop: insets.top + spacing.xxl,
              paddingBottom: spacing.xxxl,
              paddingHorizontal: spacing.xl,
              borderBottomLeftRadius: radius.xxl,
              borderBottomRightRadius: radius.xxl,
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            <Animated.View
              entering={FadeInDown.springify()}
              style={{
                width: 84,
                height: 84,
                borderRadius: radius.full,
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.28)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={[typography.headlineLarge, { color: '#FFFFFF' }]}>
                {initials}
              </Text>
            </Animated.View>

            <Animated.Text
              entering={FadeInDown.delay(80).springify()}
              style={[typography.headlineMedium, { color: '#FFFFFF' }]}
              numberOfLines={1}
            >
              {fullName}
            </Animated.Text>
            {!!phone && (
              <Animated.Text
                entering={FadeInDown.delay(120).springify()}
                style={[typography.bodyMedium, { color: 'rgba(255,255,255,0.85)' }]}
              >
                {formatPhoneNumber(phone)}
              </Animated.Text>
            )}
          </LinearGradient>

          {/* ── CARTE ────────────────────────────────────────── */}
          <View style={{ paddingHorizontal: spacing.xl, marginTop: -spacing.xl }}>
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={{
                backgroundColor: colors.surface,
                borderRadius: radius.xl,
                padding: spacing.xl,
                gap: spacing.md,
                ...elevation.lg,
              }}
            >
              <View style={{ gap: spacing.xxs, marginBottom: spacing.sm }}>
                <Text style={[typography.titleLarge, { color: colors.onSurface }]}>
                  Ravi de vous revoir
                </Text>
                <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}>
                  Saisissez votre mot de passe pour continuer
                </Text>
              </View>

              <AppInput
                label="Mot de passe"
                leftIcon="lock"
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? 'eye-off' : 'eye'}
                rightIconPress={() => setShowPassword((v) => !v)}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
              />

              {error && (
                <Animated.View
                  entering={FadeIn.duration(250)}
                  exiting={FadeOut.duration(200)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.sm,
                    backgroundColor: colors.errorContainer,
                    borderRadius: radius.sm,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                  }}
                >
                  <Feather name="alert-circle" size={18} color={colors.error} />
                  <Text
                    style={[typography.bodySmall, { color: colors.onErrorContainer, flex: 1 }]}
                  >
                    {error}
                  </Text>
                </Animated.View>
              )}

              <AppButton
                label="Déverrouiller"
                variant="filled"
                gradient
                fullWidth
                size="lg"
                rightIcon="arrow-right"
                loading={isLoading}
                disabled={isLoading}
                onPress={onUnlock}
                style={{ marginTop: spacing.xs }}
              />
            </Animated.View>

            <Pressable
              onPress={handleSwitchAccount}
              hitSlop={12}
              style={{ marginTop: spacing.xl, alignSelf: 'center' }}
            >
              <Text style={[typography.bodySmall, { color: colors.primary }]}>
                {"Ce n'est pas vous ? Changer de compte"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
});
