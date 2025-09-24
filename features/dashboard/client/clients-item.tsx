import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { colors, formatPhoneNumber, Rs, SIZES } from '@/shared/utils'
import { ThemedText } from '@/components/ThemedText'
import { COLORS } from '@/shared/common/colors'
import { withObservables } from '@nozbe/watermelondb/react'
import Client from '@/database/model/Client'
import Souscription from '@/database/model/Souscription'
import { useRouter } from 'expo-router'

type Props = {
  client: Client;
  souscriptions?: Souscription[]; // Adjust type as needed
}

const ClientItem = ({client, souscriptions}: Props) => {

    console.log("+++++++++++", client.id)
    const router = useRouter()

  return (
      <Pressable
      onPress={() =>router.push(`/(tabs)/clients/${client.id}` )}
      style={styles.card}>
         <View style={styles.icon}>
          <Feather name="user" size={18} color="black" />
         </View>
         <View style={{flex: 1, gap: Rs(5)}} >
          <ThemedText numberOfLines={1} style={{fontWeight: "600", fontSize: SIZES.mx, color: colors.titleColor}} >
            {client.firstName}
          </ThemedText>
          <ThemedText style={{fontWeight: "300", fontSize: SIZES.mx, color: colors.textColor}} >
            {formatPhoneNumber(client.phone)}
          </ThemedText>
         </View>
          <Text style={styles.numb} > {souscriptions?.length} </Text>
      </Pressable>
  )
}

const enhance = withObservables(['client'], ({ client }) => ({
  client: client ? client.observe() : null,
  souscriptions: client ? client.souscriptions.observe() : null,
  // kit: client ? client. : null,
}))
const EnhancedClientItem = enhance(ClientItem)

export default EnhancedClientItem

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: Rs(10),
    height: Rs(50)
  },
  icon:{
    position: "relative",
    width: Rs(40),
    height: Rs(40),
    justifyContent: "center",
    alignItems: "center",
     boxShadow: COLORS.boxshadow,
    borderRadius: Rs(50),
    backgroundColor: `${colors.gloryColor.c_1}20` ,
    padding: Rs(5),
  },
  numb: {
    fontSize: SIZES.mx,
    fontWeight: 'bold',
    position: "absolute",
    top: Rs(5),
    right: Rs(0),
  },

})