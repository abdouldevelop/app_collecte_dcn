import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { withObservables } from '@nozbe/watermelondb/react'
import { Q } from '@nozbe/watermelondb'
import SubscriptionTitle from './subscription-title'
import SubscriptionItem from './subscription-item'
import ScreenWrapper from '@/components/ScreenWrapper'
import SubscriptionItemPay from './subscription-item-pay'
import { Rs } from '@/shared/utils'
import { Ionicons } from '@expo/vector-icons'
import { useSouscriptions } from '@/hooks/app/useSubscription'
import { database } from '@/database/database'
import Souscription from '@/database/model/Souscription'
import Kit from '@/database/model/Kit'
import Client from '@/database/model/Client'

type Props = {
  clientId: string;
  subscriptions: Souscription[];
}

const SubscriptionList = ({ clientId, subscriptions }: Props) => {
  return (
    <ScreenWrapper>
      <SubscriptionTitle
        icon={<Ionicons name="cube" size={24} color="#059669" />}
        title="Kits souscrits"
        description="Liste des kits souscrits de la saison actuelle"
      />
     
      <View style={{gap: Rs(20)}}>
        {subscriptions.map((subscription) => (
          <SubscriptionItemPay 
            key={subscription.id}
            subscription={subscription}
          />
        ))}
        
        {/* Show message if no subscriptions */}
        {subscriptions.length === 0 && (
          <Text style={styles.emptyMessage}>
            Aucun kit souscrit pour le moment
          </Text>
        )}
      </View>
    </ScreenWrapper>
  )
}

// Enhanced version using client ID directly
const enhance = withObservables(['clientId'], ({ clientId }: { clientId: string }) => ({
  subscriptions: database.collections
    .get<Souscription>('souscriptions')
    .query(
      Q.where('client_id', clientId),
      Q.sortBy('created_at', Q.desc)
    )
    .observe()
}))

const EnhancedSubscriptionList = enhance(SubscriptionList)

export default EnhancedSubscriptionList

const styles = StyleSheet.create({
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    fontStyle: 'italic'
  }
})