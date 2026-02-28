import React from 'react';
import { View, Text } from 'react-native';
import { database } from '@/database/database';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import Versement from '@/database/model/versement';
import PaymentItem from '@/features/payment/payment-item';
import { useAppTheme } from '@/theme';
import { Feather } from '@expo/vector-icons';

type Props = {
  versements?: Versement[];
};

const LastedPayment = ({ versements }: Props) => {
  const { colors, spacing, typography, radius } = useAppTheme();

  return (
    <View style={{ flex: 1, gap: spacing.xs }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        <Feather name="credit-card" size={14} color={colors.success} />
        <Text style={[typography.labelMedium, { color: colors.onSurfaceVariant }]}>
          Derniers versements
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {versements && versements.length > 0 ? (
          versements.map((item, index) => (
            <View
              key={item.id}
              style={{
                borderTopWidth: index > 0 ? 1 : 0,
                borderTopColor: colors.outlineVariant,
                paddingHorizontal: spacing.md,
              }}
            >
              <PaymentItem versement={item} />
            </View>
          ))
        ) : (
          <Text style={[typography.bodySmall, { color: colors.onSurfaceVariant, textAlign: 'center', padding: spacing.md }]}>
            Aucun versement
          </Text>
        )}
      </View>
    </View>
  );
};

const enhance = withObservables([], () => ({
  versements: database
    .get('versements')
    .query(Q.sortBy('created_at', Q.desc), Q.take(3))
    .observeWithColumns(['amount', 'date_versement', 'souscription_id']),
}));

const EnhancedLastedPayments = enhance(LastedPayment);
export default EnhancedLastedPayments;
