import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import React, { useEffect, useState } from "react";
import SubscriptionItem from "./subscription-item";
import { ScreenContentWrapper } from "react-native-screens";
import ScreenWrapper from "@/components/ScreenWrapper";
import SubscriptionTitle from "./subscription-title";
import { Ionicons } from "@expo/vector-icons";
import GloringBtn from "@/components/form/GloringBtn";
import { Rs, SIZES } from "@/shared/utils";
import Kit from "@/database/model/Kit";
import { database } from "@/database/database";
import Souscription from "@/database/model/Souscription";

type Props = {
  id?: string;
};

const SubscriptionNew = ({ id }: Props) => {
 const [kits, setKits] = useState<Kit[]>([]);
 const [selectKits, setSelectKits] = useState<Kit[]>([]);

 useEffect(() => {
  handleGetKits();
 }, []);

  async function handleCreateKit(){
    
     try {
       return database.write(() => {
         const kit =  database.get<Kit>('kits').create(kit =>{
          kit.label = "First Kit",
          kit.saisonId = "1",
          kit.montantTotal = 1000,
          kit.createdAt = new Date().getTime()
         })

         console.log('kit', kit);
         return kit;
       });
     } catch (error) {

      console.log('========== error ==========', error);
      
     }
      
  }

    async function handleCreateSubscription(){

      try {
        if(selectKits.length === 0){
          ToastAndroid.show("Veuillez sélectionner au moins un kit", ToastAndroid.SHORT);
          return;
        }
       for(let kit of selectKits){
 
         return database.write(() => {
           const subscription =  database.get<Souscription>('souscriptions').create(sub =>{
           sub.clientId = id || '' ,
           sub.kitId = kit.id,
           sub.saisonId = kit.saisonId,
           sub.statut = "statut",
           sub.createdAt = new Date().getTime()
           })
           ToastAndroid.show("Souscription créée avec succès", ToastAndroid.TOP);
          //  console.log('kit', subscription);
           return subscription;
         });
       }
     } catch (error) {

      console.log('========== error ==========', error);
      
     }
      
     }


 async function handleGetKits() {
  try {
    const kits = await database.get<Kit>('kits').query().fetch();
    setKits(kits);
    
  } catch (error) {
    console.error("Error fetching kits:", error);
  }
 }

 function handleSelectKit(kitId: string) {
   const kit = kits.find(k => k.id === kitId); 
   if(kit) {
    const isSelected = selectKits.find(kit => kit.id ===  kitId);
    if(isSelected) {
      console.log("Deselect kit:", isSelected);
      setSelectKits(selectKits.filter(k => k.id !== kitId));
    } else {
      setSelectKits([...selectKits, kit]);
      console.log("Deselect isSelected:", kit);
    }
   }
  // setSelectKits
 }

  return (
    <ScreenWrapper>
      <SubscriptionTitle
        icon={<Ionicons name="cube" size={24} color="#059669" />}
        title="Kits disponibles"
        description="Sélectionnez un ou plusieurs kits à ajouter à votre abonnement"
      />
      {kits?.map((kit) => <SubscriptionItem key={kit?.id} kit={kit} handleSelectKit={handleSelectKit} />) }

      <GloringBtn
        VStyle={{ height: Rs(50), paddingVertical: 0 }}
        TStyle={{ fontSize: SIZES.mx }}
        label="Ajouter une souscription"
        // icon={<Ionicons name="add" size={24} color="white" />}
        action={() => handleCreateSubscription()}
      />
    </ScreenWrapper>
  );
};

export default SubscriptionNew;

const styles = StyleSheet.create({});
