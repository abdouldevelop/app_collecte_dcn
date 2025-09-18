import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText'
import { colors, Rs, SCREEN_H, SIZES } from '@/shared/utils'
import { COLORS } from '@/shared/common/colors'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { useClients } from '@/hooks/app/useClient'
import { database } from '@/database/database'
import EnhancedClientItem from '../client/clients-item'
import Client from '@/database/model/Client'
import { withObservables } from '@nozbe/watermelondb/react'
import { Q } from '@nozbe/watermelondb'
import Versement from '@/database/model/versement'
import PaymentItem from '@/features/payment/payment-item'
import SubscriptionEmptyPay from '@/features/subscription/subscription-empty-pay'

type Props = {
  versements?: Versement[]
}

const LastedPayment = ({versements}: Props) => {

  
  return (
    <View style={styles.card} >
     <ThemedText style={{fontWeight: "bold", fontSize: SIZES.lg, marginTop: Rs(20), color: colors.titleColor}}>
      Mes dernier versements
     </ThemedText>
      
     <View
      style={{ gap: Rs(10), marginTop: Rs(20)}}>
            
      { versements?.map((item, index) => (<PaymentItem key={index} versement={item} />))}
      {versements?.length === 0 && <SubscriptionEmptyPay />}

     </View>
    </View>
  )
}
const enhance = withObservables([], () => ({
  versements: database.get('versements')
    .query(
      Q.sortBy('created_at', Q.desc),
      Q.take(3)
    )
    .observeWithColumns(['amount', 'date_versement','souscription_id'])
}))


const EnhancedLastedPayments  = enhance(LastedPayment)
export default EnhancedLastedPayments

const styles = StyleSheet.create({
  card: {
    boxShadow: COLORS.boxshadow,
    padding: Rs(10),
    borderRadius: Rs(10),
    minHeight: SCREEN_H / 3,
    backgroundColor: Colors.white,
  },
})