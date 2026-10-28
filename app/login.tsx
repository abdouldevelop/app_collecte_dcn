import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HTTPError } from 'ky';

import { useAppTheme } from '@/theme';
import { FormInput, AppButton } from '@/components/ui';
import { loginSchema, LoginSchemaData } from '@/schema';
import { http } from '@/shared/http';
import { IAuth, TError } from '@/interfaces';
import { agentStore, setStorageItem } from '@/storage/MMKV';
import { prepareDatabaseForAccount, syncWithBackend } from '@/database/db_utils';
import { hashSecret } from '@/shared/crypto';

const Page = () => {
  const { colors, spacing, typography, radius, elevation } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { authenticate } = agentStore();

  const {
    handleSubmit,
    control,
  } = useForm<LoginSchemaData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
      phone: '',
    },
  });

  async function onSubmit(data: LoginSchemaData) {
    Keyboard.dismiss();
    setError(null);
    setIsLoading(true);
    try {
      const response = await http.post('agents/login', data);
      if (response) {
        const agent = response as IAuth;

        // L'identifiant serveur est prioritaire. Le téléphone normalisé sert
        // uniquement de secours pour les anciennes réponses de l'API.
        const normalizedPhone = (agent?.agent?.phone ?? data.phone).replace(/\D/g, '');
        const accountId = String(agent?.agent?.id ?? normalizedPhone);
        const preparation = await prepareDatabaseForAccount(accountId, normalizedPhone);
        if (!preparation.success) {
          setError(
            `${preparation.pendingCount} donnée(s) de l'ancien compte ne sont pas synchronisée(s). ` +
            `Reconnectez-vous avec l'ancien compte et synchronisez-les avant de changer de compte.`
          );
          return;
        }

        await setStorageItem('USER', response);
        // Mémorise le compte + le hash du mot de passe pour la reconnexion hors-ligne
        const passwordHash = await hashSecret(data.password);
        authenticate(agent, passwordHash);
        const sync = await syncWithBackend();
        ToastAndroid.show(
          sync.success ? 'Connexion et synchronisation réussies' : 'Connexion réussie, synchronisation différée',
          ToastAndroid.SHORT
        );
      }
    } catch (err) {
      if (err instanceof HTTPError) {
        const errorData: TError = (err as any).parsedBody ?? await err.response.clone().json().catch(() => ({
          message: 'Une erreur est survenue',
          statusCode: err.response.status,
        }));
        setError(errorData.message);
      } else {
        setError('Connexion impossible. Vérifiez votre réseau.');
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
          keyboardDismissMode="interactive"
        >
          {/* ── HERO (dégradé bleu + marque) ─────────────────── */}
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
              entering={FadeInDown.delay(0).springify()}
              style={{
                width: 76,
                height: 76,
                borderRadius: radius.xl,
                backgroundColor: 'rgba(255,255,255,0.18)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
              }}
            >
              <Ionicons name="wallet" size={38} color="#FFFFFF" />
            </Animated.View>

            <Animated.Text
              entering={FadeInDown.delay(80).springify()}
              style={[typography.displayMedium, { color: '#FFFFFF' }]}
            >
              APP-COLLECTE
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(140).springify()}
              style={[typography.bodyMedium, { color: 'rgba(255,255,255,0.85)', textAlign: 'center' }]}
            >
              La collecte de vos versements, simplifiée
            </Animated.Text>
          </LinearGradient>

          {/* ── CARTE FORMULAIRE (remonte sur le héro) ───────── */}
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
                <Text style={[typography.headlineMedium, { color: colors.onSurface }]}>
                  Bon retour 👋
                </Text>
                <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}>
                  Connectez-vous pour continuer
                </Text>
              </View>

              <FormInput
                control={control}
                name="phone"
                label="Téléphone"
                leftIcon="phone"
                keyboardType="phone-pad"
                placeholder="00 00 00 00 00"
              />

              <FormInput
                control={control}
                name="password"
                label="Mot de passe"
                leftIcon="lock"
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? 'eye-off' : 'eye'}
                rightIconPress={() => setShowPassword((v) => !v)}
                placeholder="••••••••"
              />

              {/* Bandeau d'erreur */}
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
                label="Se connecter"
                variant="filled"
                gradient
                fullWidth
                size="lg"
                rightIcon="arrow-right"
                loading={isLoading}
                disabled={isLoading}
                onPress={handleSubmit(onSubmit)}
                style={{ marginTop: spacing.xs }}
              />
            </Animated.View>

            {/* Note d'aide */}
            <Animated.Text
              entering={FadeIn.delay(400)}
              style={[
                typography.caption,
                {
                  color: colors.onSurfaceVariant,
                  textAlign: 'center',
                  marginTop: spacing.xl,
                },
              ]}
            >
              En cas de problème, contactez votre superviseur.
            </Animated.Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});
