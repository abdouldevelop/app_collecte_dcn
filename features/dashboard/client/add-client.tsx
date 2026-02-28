import { View, Text, ToastAndroid, Platform, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput, AppButton } from '@/components/ui';
import { ClientSchemaData, newClientSchema } from '@/schema';
import { database } from '@/database/database';
import Client from '@/database/model/Client';
import { agentStore } from '@/storage/MMKV';
import { useAppTheme } from '@/theme';

type Props = {
  closeModal: () => void;
};

const AddClient = ({ closeModal }: Props) => {
  const { colors, spacing, radius, typography } = useAppTheme();
  const { agent } = agentStore();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientSchemaData>({
    resolver: zodResolver(newClientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
    },
  });

  async function onSubmit(data: ClientSchemaData) {
    try {
      return database.write(async () => {
        const client = await database.get<Client>('clients').create((newClient) => {
          newClient.firstName = data.firstName.trim();
          newClient.lastName = data.lastName.trim();
          newClient.phone = data.phone.trim();
          newClient.agentId = agent?.agent?.id;
        });

        if (client.id) {
          reset();
          closeModal();
          if (Platform.OS === 'android') {
            ToastAndroid.showWithGravityAndOffset(
              'Client ajoute avec succes',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }
        }
        return client;
      });
    } catch (error) {
      console.log(error);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Erreur lors de l\'ajout du client', ToastAndroid.SHORT);
      } else {
        Alert.alert('Erreur', 'Impossible d\'ajouter le client');
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: spacing.xl,
          paddingBottom: spacing.xxxl,
          gap: spacing.lg,
        }}
      >
        {/* Section: Identite */}
        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.labelLarge, { color: colors.onSurfaceVariant, marginBottom: spacing.xs }]}>
            Identite
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <FormInput
                name="lastName"
                control={control}
                label="Nom"
                placeholder="Kouassi"
                leftIcon="user"
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormInput
                name="firstName"
                control={control}
                label="Prenom"
                placeholder="Aya"
              />
            </View>
          </View>
        </View>

        {/* Section: Contact */}
        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.labelLarge, { color: colors.onSurfaceVariant, marginBottom: spacing.xs }]}>
            Contact
          </Text>
          <FormInput
            name="phone"
            control={control}
            label="Telephone"
            placeholder="0701020304"
            leftIcon="phone"
            keyboardType="phone-pad"
          />
          <FormInput
            name="address"
            control={control}
            label="Adresse (optionnel)"
            placeholder="Cocody, Plateau Dokui"
            leftIcon="map-pin"
            helperText="Quartier, commune ou ville"
          />
        </View>

        {/* Submit */}
        <View style={{ marginTop: spacing.sm }}>
          <AppButton
            label="Ajouter le client"
            variant="filled"
            gradient
            fullWidth
            size="lg"
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            leftIcon="user-plus"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddClient;
