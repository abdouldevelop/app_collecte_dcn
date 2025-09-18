import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText'
import { colors, formatXOF, Rs, SIZES } from '@/shared/utils'
import Versement from '@/database/model/versement'
import { database } from '@/database/database'
import { Q } from '@nozbe/watermelondb'
import { withObservables } from '@nozbe/watermelondb/react'
import Souscription from '@/database/model/Souscription'
import Client from '@/database/model/Client'
import Kit from '@/database/model/Kit'

type Props = {
 versement: Versement
}

const PaymentItem = ({versement}: Props) => {

 const [client, setClient] = React.useState<Client>();
 const [sub, setSub] = React.useState<Souscription>();
 const [kit, setKit] = React.useState<Kit>();


  React.useEffect(() => {
    database.get<Souscription>('souscriptions').find(versement.souscriptionId)
    .then( (sub) => {     
     setSub(sub)
    })
    .catch(() => console.log('No souscription found'))
    
    if(sub){

     database.get<Client>('clients').find(sub.clientId)
    .then( client => setClient(client))
    .catch(() => console.log('No client found'))

    database.get<Kit>('kits').find(sub.kitId)
    .then( kit => setKit(kit))
    .catch(() => console.log('No kit found'))

    }
  }, [versement, sub])

  return (
    <View style={{gap: Rs(5), borderBottomWidth: 1, borderBottomColor: "white", paddingBottom: Rs(15) }} >
      <Text style={{fontSize: SIZES.mx, color: colors.textColor}}>
       {kit?.label}
      </Text>
      <ThemedText style={{fontSize: SIZES.md, fontWeight: "600", color: colors.titleColor}} >{formatXOF(versement?.montant)}</ThemedText>
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}} >
        <Text style={{fontSize: SIZES.mx, color: colors.textColor}}>{client?.firstName} </Text>
        <Text style={{fontSize: SIZES.mx, color: colors.dashitem.t_1}} >
          {new Date(versement.createdAt).toLocaleString()} 
          </Text>

      </View>
    </View>
  )
}

const enhance = withObservables(['versement'], ({versement}:{versement: Versement}) => ({
  versements: versement ? versement.observe() : null,
  // client: database.get<Souscription>('souscriptions').find(versement.souscriptionId)
  // .then( sub => sub.client).catch(() => console.log('No client found'))
}))

export default enhance(PaymentItem)

const styles = StyleSheet.create({})