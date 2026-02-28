import { ToastAndroid, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import SubscriptionItem from './subscription-item';
import { AppButton, AppEmptyState } from '@/components/ui';
import Kit from '@/database/model/Kit';
import { database } from '@/database/database';
import Souscription from '@/database/model/Souscription';
import { useAppTheme } from '@/theme';

type Props = {
  id?: string;
};

const SubscriptionNew = ({ id }: Props) => {
  const { colors, spacing, typography } = useAppTheme();
  const [kits, setKits] = useState<Kit[]>([]);
  const [selectKits, setSelectKits] = useState<Kit[]>([]);

  useEffect(() => {
    handleGetKits();
  }, []);

  async function handleCreateSubscription() {
    try {
      if (selectKits.length === 0) {
        ToastAndroid.show('Veuillez selectionner au moins un kit', ToastAndroid.SHORT);
        return;
      }
      await database.write(async () => {
        for (const kit of selectKits) {
          await database.get<Souscription>('souscriptions').create((sub) => {
            sub.clientId = id || '';
            sub.kitId = kit.id;
            sub.saisonId = kit.saisonId;
            sub.statut = 'actif';
            sub.createdAt = new Date().getTime();
          });
        }
      });
      ToastAndroid.show(
        `${selectKits.length} souscription(s) creee(s) avec succes`,
        ToastAndroid.SHORT,
      );
      setSelectKits([]);
    } catch (error) {
      console.log('========== error ==========', error);
      ToastAndroid.show('Erreur lors de la creation', ToastAndroid.SHORT);
    }
  }

  async function handleGetKits() {
    try {
      const kits = await database.get<Kit>('kits').query().fetch();
      setKits(kits);
    } catch (error) {
      console.error('Error fetching kits:', error);
    }
  }

  function handleSelectKit(kitId: string) {
    const kit = kits.find((k) => k.id === kitId);
    if (kit) {
      const isSelected = selectKits.find((k) => k.id === kitId);
      if (isSelected) {
        setSelectKits(selectKits.filter((k) => k.id !== kitId));
      } else {
        setSelectKits([...selectKits, kit]);
      }
    }
  }

  return (
    <View style={{ padding: spacing.xl, gap: spacing.sm }}>
      <Text style={[typography.labelLarge, { color: colors.onSurfaceVariant, marginBottom: spacing.xs }]}>
        Selectionnez un ou plusieurs kits
      </Text>

      {kits?.map((kit) => (
        <SubscriptionItem key={kit?.id} kit={kit} handleSelectKit={handleSelectKit} />
      ))}

      {kits.length === 0 && (
        <AppEmptyState
          icon="package"
          title="Aucun kit disponible"
          description="Aucun kit n'est disponible pour le moment"
        />
      )}

      {kits.length > 0 && (
        <View style={{ marginTop: spacing.sm }}>
          <AppButton
            label={`Ajouter ${selectKits.length > 0 ? `(${selectKits.length})` : ''}`}
            variant="filled"
            gradient
            fullWidth
            size="lg"
            onPress={handleCreateSubscription}
            leftIcon="plus"
          />
        </View>
      )}
    </View>
  );
};

export default SubscriptionNew;
