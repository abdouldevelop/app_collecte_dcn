import ScreenWrapper from '@/components/ScreenWrapper'
import { database } from '@/database/database'
import Client from '@/database/model/Client'
import DashCard from '@/features/dashboard/dash-core/dash-card'
import { useClients } from '@/hooks/app/useClient'
import { Feather, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { View, Text, Button, TextInput, FlatList, ScrollView } from 'react-native'
import { ThemedText } from '@/components/ThemedText';
import { colors, formatXOF, Rs, SIZES } from '@/shared/utils'
import { Colors } from '@/constants/Colors'
import CustomBtn from '@/components/form/CustomBtn'
import EnhancedLastedClients from '@/features/dashboard/dash-core/new-client'
import { useSouscription, useSouscriptions } from '@/hooks/app/useSubscription'
import Saison from '@/database/model/Saison'
import Kit from '@/database/model/Kit'
import Souscription from '@/database/model/Souscription'
import Agent from '@/database/model/Agent'
import EnhancedLastedPayments from '@/features/dashboard/dash-core/recent-payment'
import { withObservables } from '@nozbe/watermelondb/react'
import Versement from '@/database/model/versement'
import { syncWithBackend } from '@/database/db_utils'
import { useRouter } from 'expo-router'
import { agentStore } from '@/storage/MMKV'


type Props = {
  versements?: Versement[]
  souscriptions?: Souscription[]
  kits?: Kit[]
}

const Page = ({versements, souscriptions, kits}: Props) => {  

 const totalAmount = versements?.reduce((acc, cur) => acc + cur.montant, 0)

 const router = useRouter()
 const {logout} = agentStore();
  
 useEffect( () => {
  // syncWithBackend()
//  clearAllDatabase()
 getKits()
},  [])

async function getKits(){
  const kits = await database.get<Kit>('kits').query()
    if(kits.length > 0){
      // alert("it exists")
    }else{
       const kitData = [
        {label: "Kit 1", montantTotal: 1000},
        {label: "Kit 2", montantTotal: 2000},
        {label: "Kit 3", montantTotal: 3000},
        {label: "Kit 4", montantTotal: 4000},
        {label: "Kit 5", montantTotal: 5000},
       ]

       for (const kit of kitData) {
        await createKit(kit)
      }
    }
}

 const clearAllDatabase = async () => {
  await database.write(async () => {
    const allCollections = database.collections.map;
    
    for (const [tableName, collection] of Object.entries(allCollections)) {
      const allRecords = await collection.query().fetch();
      await database.batch(
        ...allRecords.map(record => record.prepareDestroyPermanently())
      );
    }
  });
};

async function createKit(data:{label: string, montantTotal: number}) {

  try {
    return database.write(async () => {
    const client = await database.get<Kit>('kits').create((kit) => {
         kit.label = data.label
         kit.saisonId = "1"
         kit.montantTotal = data.montantTotal
         
   })
   

  //  console.log("=============", client)

   return client
   })
    
  } catch (error) {
     console.log(error);
  }
 
}
  
  return (
    <ScreenWrapper>
       <ScrollView
       
       showsVerticalScrollIndicator={false}>

      <ThemedText style={{fontWeight: "500", fontSize: SIZES.sm, marginBottom: Rs(20), color: colors.dashitem.t_1}}>
        Saison 2
      </ThemedText>

      {/* <Button 
      title='Ajouter un kit'
      onPress={() => {
        // logout()
        // syncWithBackend()
        createKit()
      }}
      /> */}
     
      <DashCard
      label='Versements du jour'
      value={formatXOF(totalAmount || 0)}
      border={colors.dashitem.t_3}
      icon={<FontAwesome6 name="money-bills" size={16} color={colors.dashitem.t_3} />}
      action={() => console.log('action')}
      />

      <View style={{flexDirection: "row", marginVertical: Rs(20), gap: 10}} >

            <DashCard
              label='Souscriptions'
              value={souscriptions?.length || 0}
              border={colors.gloryColor.c_1}
              icon={<FontAwesome5 name="box-open" size={16} color={colors.gloryColor.c_1} />}
              action={() => console.log('action')}
              />
             <DashCard
              label='Kits'
              value={kits?.length || 0}
              border={colors.dashitem.t_1}
              icon={<FontAwesome5 name="boxes" size={16} color={colors.dashitem.t_1} />}
              action={() => console.log('action')}
              />

             
      </View>

      <View style={{gap: Rs(20)}} >

        <EnhancedLastedClients /> 

        <EnhancedLastedPayments /> 
      </View>

      
    </ScrollView>

    </ScreenWrapper>
  )
}

const enhance = withObservables([], () => ({
  versements: database.get<Versement>('versements').query().observeWithColumns(['amount']),
  souscriptions: database.get<Souscription>('souscriptions').query().observeWithColumns(['kit_id']),
  kits: database.get<Kit>('kits').query().observeWithColumns(['label']),
  
}))
const EnhancedPage = enhance(Page)

export default EnhancedPage
