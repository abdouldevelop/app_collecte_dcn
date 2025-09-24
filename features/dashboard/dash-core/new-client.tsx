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
import SubscriptionEmptyPay from '@/features/subscription/subscription-empty-pay'

type Props = {
  clients?: Client[]
}

const LastedClients = ({clients}: Props) => {
  
  
  return (
    <View style={styles.card} >
     <ThemedText style={{fontWeight: "bold", fontSize: SIZES.lg, marginTop: Rs(20), color: colors.titleColor}}>Mes dernier clients </ThemedText>
      
     <View
      style={{ gap: Rs(20), marginTop: Rs(20)}}>
      { clients?.map((item, index) => (<EnhancedClientItem key={index} client ={item} />))}

      {clients?.length === 0 && <SubscriptionEmptyPay title='Aucun client enregistré' icon='👤'/>}
     </View>
    </View>
  )
}
const enhance = withObservables([], () => ({
  clients: database.get('clients')
    .query(
      Q.sortBy('created_at', Q.desc),
      Q.take(3)
    )
    .observeWithColumns(['first_name', 'last_name', 'phone', 'updated_at'])
}))


const EnhancedLastedClients  = enhance(LastedClients)
export default EnhancedLastedClients

const styles = StyleSheet.create({
  card: {
    boxShadow: COLORS.boxshadow,
    padding: Rs(10),
    borderRadius: Rs(10),
    minHeight: SCREEN_H / 3,
    backgroundColor: Colors.white,
  },
})