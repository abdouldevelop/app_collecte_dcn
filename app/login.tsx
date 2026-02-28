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
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HTTPError } from 'ky';

import { useAppTheme } from '@/theme';
import { FormInput, AppButton } from '@/components/ui';
import { loginSchema, LoginSchemaData } from '@/schema';
import { http } from '@/shared/http';
import { IAuth, TError } from '@/interfaces';
import { agentStore, setStorageItem } from '@/storage/MMKV';
import { syncWithBackend } from '@/database/db_utils';

const Page = () => {
  const { colors, spacing, typography, radius } = useAppTheme();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = agentStore();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginSchemaData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
      phone: '',
    },
  });

  async function onSubmit(data: LoginSchemaData) {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const response = await http.post('agents/login', data);
      if (response) {
        console.log('resp===', response);
        const agent = response as IAuth;
        await setStorageItem('USER', response);
        login(agent);
        ToastAndroid.show('Connexion reussie — synchronisation...', ToastAndroid.SHORT);
        // Sync immediate apres connexion
        syncWithBackend().then((result) => {
          if (result.success) {
            ToastAndroid.show(
              `Sync OK — ${result.pullCount || 0} recu(s), ${result.pushCount || 0} envoye(s)`,
              ToastAndroid.SHORT,
            );
          } else {
            ToastAndroid.show('Echec de la synchronisation', ToastAndroid.SHORT);
          }
        });
      }
    } catch (err) {
      console.log(err);
      if (err instanceof HTTPError) {
        const errorData: TError = await err.response.json().catch(() => ({
          message: 'Unexpected error',
          statusCode: err.response.status,
        }));
        setError(errorData.message);
        setTimeout(() => {
          setError(null);
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Subtle gradient background tint */}
      <LinearGradient
        colors={[
          `${colors.gradient.primary[0]}14`,
          `${colors.gradient.primary[1]}14`,
          colors.background,
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: spacing.xl,
              paddingTop: spacing.xxxxl,
              paddingBottom: spacing.xxl,
              gap: spacing.xl,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          keyboardDismissMode="interactive"
        >
          {/* Header section */}
          <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
            <Animated.Text
              entering={FadeInDown.delay(0).springify()}
              style={[
                typography.displayLarge,
                { color: colors.onSurface },
              ]}
            >
              Bienvenue
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(100).springify()}
              style={[
                typography.bodyLarge,
                { color: colors.onSurfaceVariant },
              ]}
            >
              Connectez-vous pour continuer
            </Animated.Text>
          </View>

          {/* Form inputs */}
          <View style={{ gap: spacing.sm }}>
            <FormInput
              control={control}
              name="phone"
              label="Telephone"
              leftIcon="phone"
              keyboardType="phone-pad"
              placeholder="00 00 00 00 00"
            />

            <FormInput
              control={control}
              name="password"
              label="Mot de passe"
              leftIcon="lock"
              secureTextEntry
              placeholder="********"
            />
          </View>

          {/* Login button */}
          <AppButton
            label="Connexion"
            variant="filled"
            gradient
            fullWidth
            size="lg"
            loading={isLoading}
            disabled={isLoading}
            onPress={handleSubmit(onSubmit)}
          />

          {/* Error message */}
          {error && (
            <Animated.Text
              entering={FadeInDown.duration(400).springify().damping(12)}
              exiting={FadeOut.duration(300)}
              style={[
                typography.bodyMedium,
                {
                  color: colors.error,
                  textAlign: 'center',
                },
              ]}
            >
              {error}
            </Animated.Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
