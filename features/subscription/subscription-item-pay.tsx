import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import Souscription from '@/database/model/Souscription';
import Versement from '@/database/model/versement';
import { database } from '@/database/database';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import Kit from '@/database/model/Kit';
import { formatXOF } from '@/shared/utils';
import { agentStore } from '@/storage/MMKV';
import { AppButton, AppEmptyState } from '@/components/ui';
import { useAppTheme } from '@/theme';

type Props = {
  subscription: Souscription;
  payments: Versement[];
  kit: Kit;
};

function SubscriptionItemPay({ kit, payments: pay, subscription: sub }: Props) {
  const { colors, spacing, radius, typography } = useAppTheme();

  const [showHistory, setShowHistory] = useState(false);
  const [newPayment, setNewPayment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { agent } = agentStore();

  const totalPaid = pay?.reduce((sum, p) => sum + p.montant, 0) || 0;
  const remaining = kit.montantTotal - totalPaid;
  const progress = Math.min((totalPaid / (kit.montantTotal || 1)) * 100, 100);
  const isCompleted = progress >= 100;

  async function handleAddPayment() {
    if (newPayment === '' || parseInt(newPayment) < 100) {
      return Alert.alert(
        'Montant invalide',
        'Veuillez entrer un montant superieur a 100 FCFA'
      );
    }

    if (totalPaid + parseInt(newPayment) > kit.montantTotal) {
      return Alert.alert(
        'Montant invalide',
        'Le montant total paye ne doit pas depasser le montant total'
      );
    }

    Keyboard.dismiss();
    setIsLoading(true);
    try {
      return await database.write(async () => {
        const paid = await database
          .get<Versement>('versements')
          .create((payment) => {
            payment.souscriptionId = sub.id;
            payment.agentId = agent?.agent?.id || '';
            payment.montant = parseInt(newPayment);
            payment.dateVersement = Date.now();
            payment.createdAt = Date.now();
          });
        ToastAndroid.show('Paiement effectue', ToastAndroid.TOP);
        return paid;
      });
    } catch (error) {
      console.error('Error adding payment:', error);
    } finally {
      setIsLoading(false);
      setNewPayment('');
    }
  }

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
        overflow: 'hidden',
      }}
    >
      {/* ── Header: Kit name + status ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          gap: spacing.sm,
        }}
      >
        {isCompleted && (
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
        )}
        <Text
          style={[typography.titleMedium, { color: colors.onSurface, flex: 1 }]}
          numberOfLines={1}
        >
          {kit.label}
        </Text>
        <Text
          style={[
            typography.labelMedium,
            { color: isCompleted ? colors.success : colors.primary },
          ]}
        >
          {isCompleted ? 'Termine' : `${Math.round(progress)}%`}
        </Text>
      </View>

      {/* ── Progress bar ── */}
      <View style={{ paddingHorizontal: spacing.lg }}>
        <View
          style={{
            height: 6,
            backgroundColor: colors.surfaceContainerHigh,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: isCompleted ? colors.success : colors.primary,
              borderRadius: 3,
            }}
          />
        </View>
      </View>

      {/* ── Montants: Paye / Reste ── */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={[typography.caption, { color: colors.onSurfaceVariant }]}>
            Paye
          </Text>
          <Text style={[typography.labelLarge, { color: colors.success }]}>
            {formatXOF(totalPaid)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[typography.caption, { color: colors.onSurfaceVariant }]}>
            Reste
          </Text>
          <Text style={[typography.labelLarge, { color: remaining > 0 ? colors.error : colors.success }]}>
            {formatXOF(remaining)}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={[typography.caption, { color: colors.onSurfaceVariant }]}>
            Total
          </Text>
          <Text style={[typography.labelLarge, { color: colors.onSurface }]}>
            {formatXOF(kit.montantTotal)}
          </Text>
        </View>
      </View>

      {/* ── Payment Input (only if not completed) ── */}
      {!isCompleted && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              height: 44,
              backgroundColor: colors.surfaceVariant,
              borderRadius: radius.md,
              paddingHorizontal: spacing.md,
              ...typography.bodyMedium,
              color: colors.onSurface,
            }}
            placeholder="Montant..."
            placeholderTextColor={colors.onSurfaceVariant}
            value={newPayment}
            onChangeText={setNewPayment}
            keyboardType="numeric"
          />
          <AppButton
            label=""
            variant="filled"
            size="sm"
            onPress={handleAddPayment}
            loading={isLoading}
            leftIcon={isLoading ? undefined : 'plus'}
            style={{ width: 44, height: 44, paddingHorizontal: 0 }}
          />
        </View>
      )}

      {/* ── History toggle ── */}
      {pay.length > 0 && (
        <Pressable
          onPress={() => setShowHistory(!showHistory)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: spacing.sm,
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
            gap: spacing.xs,
          }}
        >
          <Feather
            name={showHistory ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.onSurfaceVariant}
          />
          <Text style={[typography.labelMedium, { color: colors.onSurfaceVariant }]}>
            Historique ({pay.length})
          </Text>
        </Pressable>
      )}

      {/* ── History list ── */}
      {showHistory && pay.length > 0 && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            gap: spacing.xs,
          }}
        >
          {pay.map((payment) => (
            <View
              key={payment.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: spacing.xs,
                gap: spacing.sm,
              }}
            >
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text
                style={[typography.labelMedium, { color: colors.onSurface, flex: 1 }]}
              >
                {formatXOF(payment.montant)}
              </Text>
              <Text style={[typography.caption, { color: colors.onSurfaceVariant }]}>
                {new Date(payment.dateVersement).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const enhance = withObservables(
  ['subscription'],
  ({ subscription }: { subscription: Souscription }) => ({
    subscription: subscription,
    payments: database.collections
      .get<Versement>('versements')
      .query(
        Q.where('souscription_id', subscription.id),
        Q.sortBy('created_at', Q.desc)
      )
      .observe(),
    kit: database.collections
      .get<Kit>('kits')
      .findAndObserve(subscription.kitId),
  })
);

export default enhance(SubscriptionItemPay);
