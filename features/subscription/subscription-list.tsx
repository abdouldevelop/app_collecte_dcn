import { View } from 'react-native';
import React from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import SubscriptionItemPay from './subscription-item-pay';
import { database } from '@/database/database';
import Souscription from '@/database/model/Souscription';
import { AppEmptyState } from '@/components/ui';
import { useAppTheme } from '@/theme';

type Props = {
  clientId: string;
  subscriptions: Souscription[];
};

const SubscriptionList = ({ subscriptions }: Props) => {
  const { spacing } = useAppTheme();

  return (
    <View style={{ padding: spacing.xl, gap: spacing.md }}>
      {subscriptions.map((subscription) => (
        <SubscriptionItemPay key={subscription.id} subscription={subscription} />
      ))}

      {subscriptions.length === 0 && (
        <AppEmptyState
          icon="inbox"
          title="Aucun kit souscrit"
          description="Aucune souscription pour le moment"
        />
      )}
    </View>
  );
};

const enhance = withObservables(['clientId'], ({ clientId }: { clientId: string }) => ({
  subscriptions: database.collections
    .get<Souscription>('souscriptions')
    .query(Q.where('client_id', clientId), Q.sortBy('created_at', Q.desc))
    .observe(),
}));

const EnhancedSubscriptionList = enhance(SubscriptionList);

export default EnhancedSubscriptionList;
